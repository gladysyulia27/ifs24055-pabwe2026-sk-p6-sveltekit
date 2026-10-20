<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import AddModal from "../modals/AddModal.svelte";
  import ChangeModal from "../modals/ChangeModal.svelte";
  import { coursesStore } from "../states/coursesStore";
  import { usersStore } from "../../users/states/usersStore";
  import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
  import { optimizeImage, optimizeSrcset } from "../../../helpers/imageHelper";
  import {
    Plus,
    BookOpen,
    GraduationCap,
    Star,
    Pencil,
    Trash2,
    Funnel,
    Search,
    LoaderCircle,
    UserCheck,
    Video,
    Users as UsersIcon,
  } from "lucide-svelte";
  import type { CourseDetail } from "../api/courseApi";

  let loadingCourses: boolean = false;
  let filter: string = "";
  let searchQuery: string = "";
  let showAddModal: boolean = false;
  let showChangeModal: boolean = false;
  let selectedCourse: CourseDetail | null = null;

  $: profile = $usersStore.profile;
  $: courses = $coursesStore.courses || [];

  onMount(() => {
    loadCourses();
  });

  function loadCourses() {
    loadingCourses = true;
    Promise.resolve(coursesStore.asyncSetCourses(filter)).finally(() => {
      loadingCourses = false;
    });
  }

  let prevFilter = filter;
  $: if (filter !== prevFilter) {
    prevFilter = filter;
    loadCourses();
  }

  $: if ($coursesStore.isCourseDeleted) {
    coursesStore.setIsCourseDeleted(false);
    loadCourses();
  }

  $: if ($coursesStore.isCourseDeletedAll) {
    coursesStore.setIsCourseDeletedAll(false);
    loadCourses();
  }

  function handleEditCourse(course: any) {
    selectedCourse = course;
    showChangeModal = true;
  }

  async function handleDeleteCourse(courseId: number | string) {
    const result = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus kursus ini?"
    );
    if (result.isConfirmed) {
      coursesStore.asyncSetIsCourseDelete(courseId);
    }
  }

  async function handleDeleteAll() {
    const result = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus SEMUA kursus milik Anda?"
    );
    if (result.isConfirmed) {
      coursesStore.asyncSetIsCourseDeleteAll();
    }
  }

  $: filteredCourses = courses.filter((course) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = course.title ? course.title.toLowerCase() : "";
    const description = course.description ? course.description.toLowerCase() : "";
    return title.includes(q) || description.includes(q);
  });

  $: totalCount = courses.length;
  $: myCount = courses.filter((c) => c.user_id === profile?.id).length;
  $: totalContentsCount = courses.reduce(
    (acc, c) => acc + (c.total_contents || 0),
    0
  );
</script>

{#if profile}
  <div class="space-y-8 animate-in fade-in duration-300">
    <!-- Header Banner -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Daftar Kursus
        </h1>
        <p class="text-sm text-slate-600 mt-1">
          Jelajahi dan pelajari berbagai materi kursus yang tersedia secara interaktif.
        </p>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto">
        {#if courses.length > 0}
          <button
            type="button"
            data-testid="delete-all-btn"
            onclick={handleDeleteAll}
            class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-sm text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-all"
          >
            <Trash2 size={16} />
            <span>Hapus Semua</span>
          </button>
        {/if}
        <button
          type="button"
          data-testid="add-course-btn"
          onclick={() => (showAddModal = true)}
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Tambah Kursus</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Total Kursus
          </h2>
          <p class="text-3xl font-black text-slate-800 mt-1">{totalCount}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <GraduationCap size={26} strokeWidth={2} />
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Kursus Saya
          </h2>
          <p class="text-3xl font-black text-emerald-600 mt-1">{myCount}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <UserCheck size={26} strokeWidth={2} />
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Total Materi
          </h2>
          <p class="text-3xl font-black text-amber-600 mt-1">{totalContentsCount}</p>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Video size={26} strokeWidth={2} />
        </div>
      </div>
    </div>

    <!-- Filter & Controls Section -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <!-- Filter bar -->
      <div class="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <Search size={18} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            data-testid="search-course-input"
            bind:value={searchQuery}
            placeholder="Cari judul atau materi kursus..."
            class="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          />
        </div>

        <div class="flex items-center gap-2.5">
          <span class="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
            <Funnel size={16} /> Filter:
          </span>
          <div class="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
            <button
              type="button"
              data-testid="filter-all-btn"
              onclick={() => (filter = "")}
              class="px-3 py-1.5 rounded-lg transition-all {filter === '' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}"
            >
              Semua
            </button>
            <button
              type="button"
              data-testid="filter-my-btn"
              onclick={() => (filter = "1")}
              class="px-3 py-1.5 rounded-lg transition-all {filter === '1' ? 'bg-white text-emerald-700 shadow-xs' : 'hover:text-slate-900'}"
            >
              Milik Saya
            </button>
          </div>
        </div>
      </div>

      <!-- Course Cards Grid -->
      <div class="p-4 sm:p-6">
        {#if loadingCourses}
          <div class="py-16 text-center">
            <LoaderCircle size={32} class="animate-spin text-indigo-600 mx-auto mb-3" />
            <p class="text-sm font-medium text-slate-600">Memuat data kursus...</p>
          </div>
        {:else if filteredCourses.length === 0}
          <div class="py-16 text-center">
            <div class="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} />
            </div>
            <h3 class="text-base font-bold text-slate-800">Belum ada kursus</h3>
            <p class="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
              {searchQuery ? "Tidak ada kursus yang cocok dengan pencarian Anda." : "Mulai dengan membuat kursus pembelajaran baru sekarang."}
            </p>
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredCourses as course, index (course.id)}
              {@const isOwner = course.user_id === profile?.id}
              {@const isStudent = course.students && (course.students.includes(profile?.id as any) || (course.students as any).some((s: any) => s === profile?.id || s?.id === profile?.id))}
              <div
                data-testid={`course-card-${course.id}`}
                class="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                <!-- Cover Image -->
                <div class="h-44 w-full bg-gradient-to-tr from-indigo-900 via-indigo-700 to-indigo-500 relative overflow-hidden flex items-center justify-center">
                  {#if course.cover}
                    <img
                      src={optimizeImage(course.cover, 640)}
                      srcset={optimizeSrcset(course.cover, [384, 640, 828])}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      width="640"
                      height="352"
                      loading={index < 3 ? "eager" : "lazy"}
                      decoding="async"
                      alt={course.title}
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  {:else}
                    <GraduationCap size={48} class="text-white/40" />
                  {/if}

                  <div class="absolute top-3 right-3 flex items-center gap-1.5">
                    {#if isOwner}
                      <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-700 text-white shadow-xs">
                        Milik Saya
                      </span>
                    {:else if isStudent}
                      <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-700 text-white shadow-xs">
                        Terdaftar
                      </span>
                    {/if}
                  </div>
                </div>

                <!-- Card Body -->
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-2 mb-2 text-xs text-slate-600">
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
                      <span class="font-medium text-slate-600">{course.author?.name || "Pengajar"}</span>
                      <span>•</span>
                      <span>{formatDate(course.created_at)}</span>
                    </div>

                    <a
                      href={`/courses/${course.id}`}
                      onclick={(e) => {
                        e.preventDefault();
                        goto(`/courses/${course.id}`);
                      }}
                      class="block font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1"
                    >
                      {course.title}
                    </a>

                    <p class="text-xs text-slate-600 mt-1.5 line-clamp-2">
                      {course.description || "Tidak ada deskripsi"}
                    </p>
                  </div>

                  <div class="mt-4 pt-4 border-t border-slate-100">
                    <div class="flex items-center justify-between text-xs text-slate-600 mb-3">
                      <span class="flex items-center gap-1">
                        <Video size={14} class="text-slate-500" />
                        {course.total_contents || 0} Materi
                      </span>
                      <span class="flex items-center gap-1">
                        <Star size={14} class="text-amber-500 fill-amber-500" />
                        {course.avg_ratings || "-"}
                      </span>
                      <span class="flex items-center gap-1">
                        <UsersIcon size={14} class="text-slate-500" />
                        {course.students?.length || 0} Siswa
                      </span>
                    </div>

                    <div class="flex items-center gap-2">
                      <a
                        href={`/courses/${course.id}`}
                        data-testid={`view-course-btn-${course.id}`}
                        onclick={(e) => {
                          e.preventDefault();
                          goto(`/courses/${course.id}`);
                        }}
                        class="flex-1 text-center py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                      >
                        Lihat Kursus
                      </a>

                      {#if isOwner}
                        <button
                          type="button"
                          data-testid={`edit-course-btn-${course.id}`}
                          onclick={() => handleEditCourse(course)}
                          class="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
                          title="Ubah Kursus"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          data-testid={`delete-course-btn-${course.id}`}
                          onclick={() => handleDeleteCourse(course.id)}
                          class="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Hapus Kursus"
                        >
                          <Trash2 size={15} />
                        </button>
                      {/if}
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Modals -->
    <AddModal show={showAddModal} onClose={() => (showAddModal = false)} />
    <ChangeModal
      show={showChangeModal}
      course={selectedCourse}
      onClose={() => (showChangeModal = false)}
    />
  </div>
{/if}
