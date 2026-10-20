<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { coursesStore } from "../states/coursesStore";
  import { usersStore } from "../../users/states/usersStore";
  import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
  import { optimizeImage, optimizeSrcset } from "../../../helpers/imageHelper";
  import MarkdownViewer from "../components/MarkdownViewer.svelte";
  import ChangeModal from "../modals/ChangeModal.svelte";
  import ChangeCoverModal from "../modals/ChangeCoverModal.svelte";
  import ContentModal from "../modals/ContentModal.svelte";
  import {
    GraduationCap,
    Star,
    Video,
    Users as UsersIcon,
    Pencil,
    Trash2,
    ImagePlus,
    Plus,
    CheckCircle2,
    Clock,
    ArrowLeft,
    LogOut,
    UserPlus,
    Send,
  } from "lucide-svelte";
  import type { CourseContent } from "../api/courseApi";

  export let courseId: string | number = "";

  let showChangeModal: boolean = false;
  let showChangeCoverModal: boolean = false;
  let showContentModal: boolean = false;
  let selectedContent: CourseContent | null = null;

  let ratingScore: number = 5;
  let ratingComment: string = "";

  $: profile = $usersStore.profile;
  $: course = $coursesStore.course;

  onMount(() => {
    if (courseId) {
      coursesStore.asyncSetCourse(courseId);
    }
  });

  let prevCourseId = courseId;
  $: if (courseId && courseId !== prevCourseId) {
    prevCourseId = courseId;
    coursesStore.asyncSetCourse(courseId);
  }

  $: isOwner = !!(profile && course && course.user_id === profile.id);
  $: isStudent = !!(
    profile &&
    course &&
    course.students &&
    (course.students.includes(profile.id as any) ||
      (course.students as any).some((s: any) => s === profile?.id || s?.id === profile?.id))
  );

  $: if ($coursesStore.isCourseDeleted) {
    coursesStore.setIsCourseDeleted(false);
    goto("/");
  }

  $: if ($coursesStore.isStudentAdded) {
    coursesStore.setIsStudentAdded(false);
    coursesStore.asyncSetCourse(courseId);
  }

  $: if ($coursesStore.isStudentDeleted) {
    coursesStore.setIsStudentDeleted(false);
    coursesStore.asyncSetCourse(courseId);
  }

  $: if ($coursesStore.isRatingChanged) {
    coursesStore.setIsRatingChanged(false);
    ratingComment = "";
    coursesStore.asyncSetCourse(courseId);
  }

  $: if ($coursesStore.isContentDeleted) {
    coursesStore.setIsContentDeleted(false);
    coursesStore.asyncSetCourse(courseId);
  }

  async function handleDeleteCourse() {
    const res = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus kursus ini?"
    );
    if (res.isConfirmed && course?.id) {
      coursesStore.asyncSetIsCourseDelete(course.id);
    }
  }

  async function handleJoinCourse() {
    if (course?.id) {
      coursesStore.asyncSetIsStudentAdd(course.id);
    }
  }

  async function handleLeaveCourse() {
    const res = await showConfirmDialog(
      "Apakah Anda yakin ingin keluar dari kursus ini?"
    );
    if (res.isConfirmed && course?.id) {
      coursesStore.asyncSetIsStudentDelete(course.id);
    }
  }

  function handleOpenAddContent() {
    selectedContent = null;
    showContentModal = true;
  }

  function handleOpenEditContent(content: CourseContent) {
    selectedContent = content;
    showContentModal = true;
  }

  async function handleDeleteContent(contentId: number) {
    const res = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus materi konten ini?"
    );
    if (res.isConfirmed) {
      coursesStore.asyncSetIsContentDelete(contentId);
    }
  }

  function handleSubmitRating() {
    if (!ratingComment.trim()) return;
    if (course?.id) {
      coursesStore.asyncSetIsRatingChange(course.id, Number(ratingScore), ratingComment.trim());
    }
  }
</script>

<div class="space-y-8 animate-in fade-in duration-300">
  <!-- Back Button -->
  <div>
    <a
      href="/"
      onclick={(e) => {
        e.preventDefault();
        goto("/");
      }}
      data-testid="back-to-courses-btn"
      class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
    >
      <ArrowLeft size={18} />
      <span>Kembali ke Semua Kursus</span>
    </a>
  </div>

  {#if !course}
    <div class="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <h1 class="text-sm text-slate-600">Memuat detail kursus...</h1>
    </div>
  {:else}
    <!-- Hero / Cover Banner -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="h-64 sm:h-80 w-full bg-gradient-to-tr from-indigo-950 via-indigo-800 to-indigo-600 relative overflow-hidden flex items-center justify-center">
        {#if course.cover}
          <img
            src={optimizeImage(course.cover, 1080)}
            srcset={optimizeSrcset(course.cover, [640, 1080, 1200, 1920])}
            sizes="(min-width: 1280px) 1200px, 100vw"
            width="1200"
            height="320"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            alt={course.title}
            class="w-full h-full object-cover"
          />
        {:else}
          <div class="flex flex-col items-center text-white/50 gap-2">
            <GraduationCap size={64} />
            <span class="text-xs font-medium">Belum ada cover</span>
          </div>
        {/if}

        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

        <div class="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div>
            <div class="flex items-center gap-2 mb-2 text-xs text-slate-300">
              {#if course.author?.photo}
                <img
                  src={optimizeImage(course.author.photo, 64)}
                  width="20"
                  height="20"
                  loading="lazy"
                  decoding="async"
                  alt={course.author.name}
                  class="w-5 h-5 shrink-0 rounded-full object-cover"
                />
              {/if}
              <span class="font-medium text-white">{course.author?.name || "Pengajar"}</span>
              <span>•</span>
              <span>Dibuat {formatDate(course.created_at)}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {course.title}
            </h1>
          </div>

          <!-- Action Buttons in Hero -->
          <div class="flex items-center gap-2 flex-wrap">
            {#if isOwner}
              <button
                type="button"
                data-testid="edit-course-btn"
                onclick={() => (showChangeModal = true)}
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-all"
              >
                <Pencil size={15} />
                <span>Ubah Data</span>
              </button>
              <button
                type="button"
                data-testid="change-cover-btn"
                onclick={() => (showChangeCoverModal = true)}
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/20 hover:bg-white/30 text-white backdrop-blur-md shadow-md transition-all"
              >
                <ImagePlus size={15} />
                <span>Ubah Sampul</span>
              </button>
              <button
                type="button"
                data-testid="delete-course-btn"
                onclick={handleDeleteCourse}
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-600/80 hover:bg-red-600 text-white shadow-md transition-all"
              >
                <Trash2 size={15} />
                <span>Hapus</span>
              </button>
            {:else if isStudent}
              <button
                type="button"
                data-testid="leave-course-btn"
                onclick={handleLeaveCourse}
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-600/90 hover:bg-red-600 text-white shadow-md transition-all"
              >
                <LogOut size={15} />
                <span>Keluar Kursus</span>
              </button>
            {:else}
              <button
                type="button"
                data-testid="join-course-btn"
                onclick={handleJoinCourse}
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 transition-all"
              >
                <UserPlus size={18} />
                <span>Daftar Kursus</span>
              </button>
            {/if}
          </div>
        </div>
      </div>

      <!-- Quick Stats & Progress Bar -->
      <div class="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-6 text-sm text-slate-600">
          <span class="flex items-center gap-1.5 font-medium">
            <Video size={16} class="text-indigo-600" />
            {course.total_contents || course.contents?.length || 0} Materi
          </span>
          <span class="flex items-center gap-1.5 font-medium">
            <Star size={16} class="text-amber-500 fill-amber-500" />
            {course.avg_ratings || "Belum ada rating"}
          </span>
          <span class="flex items-center gap-1.5 font-medium">
            <UsersIcon size={16} class="text-emerald-600" />
            {course.students?.length || 0} Siswa Terdaftar
          </span>
        </div>

        {#if isStudent && !isOwner}
          <div class="flex items-center gap-3">
            <span class="text-xs font-semibold text-slate-700">Progres Belajar:</span>
            <div class="w-36 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-emerald-500 rounded-full transition-all"
                style={`width: ${course.my_percentage_finished || 0}%`}
              ></div>
            </div>
            <span class="text-xs font-bold text-emerald-600">
              {course.my_percentage_finished || 0}%
            </span>
          </div>
        {/if}
      </div>

      <!-- Description Section -->
      <div class="p-6 sm:p-8">
        <h2 class="text-lg font-bold text-slate-800 mb-3">Tentang Kursus</h2>
        <div class="prose max-w-none text-slate-600 text-sm">
          <MarkdownViewer content={course.description || ""} />
        </div>
      </div>
    </div>

    <!-- Contents Section -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Materi Pembelajaran</h2>
          <p class="text-xs text-slate-600 mt-0.5">Daftar video dan modul pembelajaran</p>
        </div>

        {#if isOwner}
          <button
            type="button"
            data-testid="add-content-btn"
            onclick={handleOpenAddContent}
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Tambah Materi</span>
          </button>
        {/if}
      </div>

      <div class="divide-y divide-slate-100">
        {#if !course.contents || course.contents.length === 0}
          <div class="p-12 text-center text-slate-600">
            <Video size={36} class="mx-auto mb-2 opacity-50" />
            <p class="text-sm">Belum ada materi pembelajaran pada kursus ini.</p>
          </div>
        {:else}
          {#each course.contents as item, idx (item.id)}
            <div
              data-testid={`content-item-${item.id}`}
              class="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div class="flex items-center gap-3.5 min-w-0">
                <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                  {idx + 1}
                </div>
                <div class="min-w-0">
                  <a
                    href={`/courses/${course.id}/contents/${item.id}`}
                    onclick={(e) => {
                      e.preventDefault();
                      goto(`/courses/${course.id}/contents/${item.id}`);
                    }}
                    class="block font-semibold text-sm text-slate-800 hover:text-indigo-600 transition-colors truncate"
                  >
                    {item.title}
                  </a>
                  <div class="flex items-center gap-2 mt-1">
                    {#if item.my_status_finished}
                      <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={12} /> Selesai
                      </span>
                    {:else}
                      <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        <Clock size={12} /> Belum Selesai
                      </span>
                    {/if}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <a
                  href={`/courses/${course.id}/contents/${item.id}`}
                  onclick={(e) => {
                    e.preventDefault();
                    goto(`/courses/${course.id}/contents/${item.id}`);
                  }}
                  data-testid={`open-content-btn-${item.id}`}
                  class="px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  Buka Materi
                </a>

                {#if isOwner}
                  <button
                    type="button"
                    data-testid={`edit-content-btn-${item.id}`}
                    onclick={() => handleOpenEditContent(item)}
                    class="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    data-testid={`delete-content-btn-${item.id}`}
                    onclick={() => handleDeleteContent(item.id)}
                    class="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>

    <!-- Rating & Review Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Ratings List -->
      <div class="md:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        <h2 class="text-lg font-bold text-slate-900 mb-1">Ulasan & Rating Siswa</h2>
        <p class="text-xs text-slate-600 mb-6">Pengalaman dan umpan balik dari peserta kursus</p>

        {#if !course.ratings || course.ratings.length === 0}
          <div class="p-8 text-center text-slate-600 border border-dashed border-slate-200 rounded-2xl">
            <Star size={32} class="mx-auto mb-2 opacity-40 text-amber-500" />
            <p class="text-sm">Belum ada ulasan untuk kursus ini.</p>
          </div>
        {:else}
          <div class="space-y-4">
            {#each course.ratings as r (r.name + r.comment)}
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="font-bold text-sm text-slate-800">{r.name}</span>
                  <div class="flex items-center gap-1 text-amber-500">
                    <Star size={14} class="fill-amber-500" />
                    <span class="text-xs font-bold">{r.ratings}/5</span>
                  </div>
                </div>
                <p class="text-xs text-slate-600">{r.comment}</p>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Rating Input Form for Enrolled Students -->
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-900 mb-1">Beri Ulasan</h3>
          <p class="text-xs text-slate-600 mb-4">
            {isStudent && !isOwner ? "Berikan penilaian dan masukan Anda untuk kursus ini." : "Hanya siswa terdaftar yang dapat memberikan rating kursus."}
          </p>

          {#if isStudent && !isOwner}
            <form
              onsubmit={(e) => {
                e.preventDefault();
                handleSubmitRating();
              }}
              class="space-y-4"
            >
              <div>
                <label for="rating-select" class="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                  Nilai Bintang
                </label>
                <select
                  id="rating-select"
                  data-testid="rating-select"
                  bind:value={ratingScore}
                  class="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Sangat Puas)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Bagus)</option>
                  <option value={3}>⭐⭐⭐ (3 - Cukup)</option>
                  <option value={2}>⭐⭐ (2 - Kurang)</option>
                  <option value={1}>⭐ (1 - Buruk)</option>
                </select>
              </div>

              <div>
                <label for="rating-comment" class="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                  Komentar Ulasan
                </label>
                <textarea
                  id="rating-comment"
                  data-testid="rating-comment-input"
                  bind:value={ratingComment}
                  rows="4"
                  placeholder="Ceritakan pengalaman belajar Anda..."
                  class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                data-testid="submit-rating-btn"
                class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-md shadow-amber-500/25 transition-all"
              >
                <Send size={14} />
                <span>Kirim Ulasan</span>
              </button>
            </form>
          {:else}
            <div class="p-6 text-center text-slate-600 bg-slate-50 rounded-2xl border border-slate-100">
              <Star size={28} class="mx-auto mb-2 opacity-40 text-amber-400" />
              <p class="text-xs">
                {isOwner ? "Anda adalah pemilik kursus ini." : "Daftar kursus ini untuk menulis ulasan."}
              </p>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ChangeModal
      show={showChangeModal}
      {course}
      onClose={() => (showChangeModal = false)}
    />
    <ChangeCoverModal
      show={showChangeCoverModal}
      {course}
      onClose={() => (showChangeCoverModal = false)}
    />
    <ContentModal
      show={showContentModal}
      courseId={course.id}
      content={selectedContent}
      onClose={() => (showContentModal = false)}
    />
  {/if}
</div>
