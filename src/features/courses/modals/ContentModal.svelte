<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Plus, Pencil, X, LoaderCircle, Video } from "lucide-svelte";
  import { coursesStore } from "../states/coursesStore";
  import { showErrorDialog } from "../../../helpers/toolsHelper";
  import type { CourseContent } from "../api/courseApi";

  export let show: boolean = false;
  export let courseId: string | number = "";
  export let content: CourseContent | null = null;
  export let onClose: (() => void) | undefined = undefined;

  const dispatch = createEventDispatcher();

  let loading: boolean = false;
  let title: string = "";
  let youtube: string = "";

  $: isEditMode = !!content?.id;

  $: if (show) {
    if (content) {
      title = content.title || "";
      youtube = content.youtube || "";
    } else {
      title = "";
      youtube = "";
    }
  }

  function handleClose() {
    title = "";
    youtube = "";
    dispatch("close");
    if (onClose) onClose();
  }

  $: {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }

  $: if ($coursesStore.isContentAdd) {
    loading = false;
    coursesStore.setIsContentAdd(false);
    if ($coursesStore.isContentAdded) {
      coursesStore.setIsContentAdded(false);
      if (courseId) {
        coursesStore.asyncSetCourse(courseId);
      }
      handleClose();
    }
  }

  $: if ($coursesStore.isContentChange) {
    loading = false;
    coursesStore.setIsContentChange(false);
    if ($coursesStore.isContentChanged) {
      coursesStore.setIsContentChanged(false);
      if (courseId) {
        coursesStore.asyncSetCourse(courseId);
      }
      handleClose();
    }
  }

  function handleSave() {
    if (!title.trim()) {
      showErrorDialog("Judul materi tidak boleh kosong");
      return;
    }

    if (!youtube.trim()) {
      showErrorDialog("Tautan video YouTube tidak boleh kosong");
      return;
    }

    loading = true;
    if (isEditMode && content?.id) {
      coursesStore.asyncSetIsContentChange(content.id, title.trim(), youtube.trim());
    } else {
      coursesStore.asyncSetIsContentAdd(courseId, title.trim(), youtube.trim());
    }
  }
</script>

{#if show}
  <div
    data-testid="content-modal"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
  >
    <div
      class="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
    >
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
            {#if isEditMode}
              <Pencil size={18} strokeWidth={2.5} />
            {:else}
              <Plus size={18} strokeWidth={2.5} />
            {/if}
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-800">
              {isEditMode ? "Ubah Materi Konten" : "Tambah Materi Konten"}
            </h3>
            <p class="text-xs text-slate-600">
              {isEditMode ? "Perbarui judul atau video materi" : "Tambahkan materi video YouTube baru untuk kursus ini"}
            </p>
          </div>
        </div>
        <button
          type="button"
          data-testid="close-modal-btn"
          on:click={handleClose}
          class="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <form on:submit|preventDefault={handleSave} class="p-6 space-y-4">
        <div>
          <label for="content-title-input" class="block text-sm font-semibold text-slate-700 mb-1.5">
            Judul Materi <span class="text-red-500">*</span>
          </label>
          <input
            id="content-title-input"
            type="text"
            data-testid="content-title-input"
            bind:value={title}
            placeholder="Contoh: Pengenalan SvelteKit 3"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm shadow-xs"
            required
          />
        </div>

        <div>
          <label for="content-youtube-input" class="block text-sm font-semibold text-slate-700 mb-1.5">
            Tautan YouTube <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Video size={18} />
            </div>
            <input
              id="content-youtube-input"
              type="url"
              data-testid="content-youtube-input"
              bind:value={youtube}
              placeholder="https://youtu.be/... atau https://www.youtube.com/watch?v=..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm shadow-xs"
              required
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            data-testid="cancel-content-btn"
            on:click={handleClose}
            disabled={loading}
            class="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            data-testid="content-submit-button"
            disabled={loading}
            class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/25 transition-all disabled:opacity-60"
          >
            {#if loading}
              <LoaderCircle size={18} class="animate-spin" />
              <span>Menyimpan...</span>
            {:else if isEditMode}
              <Pencil size={18} strokeWidth={2.5} />
              <span>Simpan Perubahan</span>
            {:else}
              <Plus size={18} strokeWidth={2.5} />
              <span>Tambah Materi</span>
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
