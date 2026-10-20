<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { coursesStore } from "../states/coursesStore";
  import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Video,
    LoaderCircle,
  } from "lucide-svelte";

  export let courseId: string | number = "";
  export let contentId: string | number = "";

  $: content = $coursesStore.content;
  $: course = $coursesStore.course;

  onMount(() => {
    if (contentId) {
      coursesStore.asyncSetContent(contentId);
    }
    if (courseId) {
      coursesStore.asyncSetCourse(courseId);
    }
  });

  let prevContentId = contentId;
  $: if (contentId && contentId !== prevContentId) {
    prevContentId = contentId;
    coursesStore.asyncSetContent(contentId);
  }

  $: if ($coursesStore.isContentChangeStatus) {
    coursesStore.setIsContentChangeStatus(false);
    if ($coursesStore.isContentChangedStatus) {
      coursesStore.setIsContentChangedStatus(false);
      coursesStore.asyncSetContent(contentId);
      if (courseId) {
        coursesStore.asyncSetCourse(courseId);
      }
    }
  }

  function getEmbedUrl(url: string = ""): string {
    if (!url) return "";
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  }

  function handleToggleStatus() {
    if (!content?.id) return;
    const newStatus = content.my_status_finished ? 0 : 1;
    coursesStore.asyncSetIsContentChangeStatus(content.id, newStatus);
  }
</script>

<div class="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
  <!-- Back Button -->
  <div>
    <a
      href={`/courses/${courseId}`}
      on:click|preventDefault={() => goto(`/courses/${courseId}`)}
      data-testid="back-to-course-btn"
      class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
    >
      <ArrowLeft size={18} />
      <span>Kembali ke Detail Kursus ({course?.title || "Kursus"})</span>
    </a>
  </div>

  {#if !content}
    <div class="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs">
      <LoaderCircle size={32} class="animate-spin text-indigo-600 mx-auto mb-3" />
      <h1 class="text-sm text-slate-600">Memuat materi pembelajaran...</h1>
    </div>
  {:else}
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <!-- Video Player Frame -->
      <div class="w-full bg-slate-950 aspect-video relative flex items-center justify-center">
        {#if content.youtube}
          <iframe
            data-testid="youtube-iframe"
            src={getEmbedUrl(content.youtube)}
            title={content.title}
            class="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        {:else}
          <div class="flex flex-col items-center gap-2 text-white/50">
            <Video size={48} />
            <span class="text-sm">Video tidak tersedia</span>
          </div>
        {/if}
      </div>

      <!-- Content Details & Completion Toggle -->
      <div class="p-6 sm:p-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div class="flex items-center gap-2 mb-2">
              {#if content.my_status_finished}
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <CheckCircle2 size={14} /> Selesai Dipelajari
                </span>
              {:else}
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                  <Clock size={14} /> Belum Selesai
                </span>
              {/if}
            </div>

            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
              {content.title}
            </h1>
          </div>

          <!-- Status Toggle Action Button -->
          <div>
            <button
              type="button"
              data-testid="toggle-finished-btn"
              on:click={handleToggleStatus}
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all {content.my_status_finished ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25'}"
            >
              <CheckCircle2 size={18} />
              <span>
                {content.my_status_finished ? "Tandai Belum Selesai" : "Tandai Selesai"}
              </span>
            </button>
          </div>
        </div>

        <div class="flex items-center gap-2 text-xs text-slate-600">
          <Video size={16} class="text-indigo-600" />
          <span>Tautan video:</span>
          <a
            href={content.youtube}
            target="_blank"
            rel="noopener noreferrer"
            class="text-indigo-600 hover:underline break-all"
          >
            {content.youtube}
          </a>
        </div>
      </div>
    </div>
  {/if}
</div>
