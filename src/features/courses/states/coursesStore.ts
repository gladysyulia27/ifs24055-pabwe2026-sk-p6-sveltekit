import { writable } from "svelte/store";
import courseApi, {
  type Course,
  type CourseDetail,
  type CourseContent,
} from "../api/courseApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

export interface CoursesState {
  courses: Course[];
  course: CourseDetail | null;
  content: CourseContent | null;
  isCourse: boolean;
  isContent: boolean;
  isCourseAdd: boolean;
  isCourseAdded: boolean;
  isCourseChange: boolean;
  isCourseChanged: boolean;
  isCourseChangeCover: boolean;
  isCourseChangedCover: boolean;
  isCourseDelete: boolean;
  isCourseDeleted: boolean;
  isCourseDeleteAll: boolean;
  isCourseDeletedAll: boolean;
  isStudentAdd: boolean;
  isStudentAdded: boolean;
  isStudentDelete: boolean;
  isStudentDeleted: boolean;
  isRatingChange: boolean;
  isRatingChanged: boolean;
  isContentAdd: boolean;
  isContentAdded: boolean;
  isContentChange: boolean;
  isContentChanged: boolean;
  isContentDelete: boolean;
  isContentDeleted: boolean;
  isContentChangeStatus: boolean;
  isContentChangedStatus: boolean;
}

function createCoursesStore() {
  const initial: CoursesState = {
    courses: [],
    course: null,
    content: null,
    isCourse: false,
    isContent: false,
    isCourseAdd: false,
    isCourseAdded: false,
    isCourseChange: false,
    isCourseChanged: false,
    isCourseChangeCover: false,
    isCourseChangedCover: false,
    isCourseDelete: false,
    isCourseDeleted: false,
    isCourseDeleteAll: false,
    isCourseDeletedAll: false,
    isStudentAdd: false,
    isStudentAdded: false,
    isStudentDelete: false,
    isStudentDeleted: false,
    isRatingChange: false,
    isRatingChanged: false,
    isContentAdd: false,
    isContentAdded: false,
    isContentChange: false,
    isContentChanged: false,
    isContentDelete: false,
    isContentDeleted: false,
    isContentChangeStatus: false,
    isContentChangedStatus: false,
  };

  let currentState: CoursesState = { ...initial };
  const innerStore = writable<CoursesState>(currentState);
  innerStore.subscribe((val) => {
    currentState = val;
  });

  return {
    subscribe: innerStore.subscribe,
    get courses() {
      return currentState.courses;
    },
    get course() {
      return currentState.course;
    },
    get content() {
      return currentState.content;
    },
    get isCourse() {
      return currentState.isCourse;
    },
    get isContent() {
      return currentState.isContent;
    },
    get isCourseAdd() {
      return currentState.isCourseAdd;
    },
    get isCourseAdded() {
      return currentState.isCourseAdded;
    },
    get isCourseChange() {
      return currentState.isCourseChange;
    },
    get isCourseChanged() {
      return currentState.isCourseChanged;
    },
    get isCourseChangeCover() {
      return currentState.isCourseChangeCover;
    },
    get isCourseChangedCover() {
      return currentState.isCourseChangedCover;
    },
    get isCourseDelete() {
      return currentState.isCourseDelete;
    },
    get isCourseDeleted() {
      return currentState.isCourseDeleted;
    },
    get isCourseDeleteAll() {
      return currentState.isCourseDeleteAll;
    },
    get isCourseDeletedAll() {
      return currentState.isCourseDeletedAll;
    },
    get isStudentAdd() {
      return currentState.isStudentAdd;
    },
    get isStudentAdded() {
      return currentState.isStudentAdded;
    },
    get isStudentDelete() {
      return currentState.isStudentDelete;
    },
    get isStudentDeleted() {
      return currentState.isStudentDeleted;
    },
    get isRatingChange() {
      return currentState.isRatingChange;
    },
    get isRatingChanged() {
      return currentState.isRatingChanged;
    },
    get isContentAdd() {
      return currentState.isContentAdd;
    },
    get isContentAdded() {
      return currentState.isContentAdded;
    },
    get isContentChange() {
      return currentState.isContentChange;
    },
    get isContentChanged() {
      return currentState.isContentChanged;
    },
    get isContentDelete() {
      return currentState.isContentDelete;
    },
    get isContentDeleted() {
      return currentState.isContentDeleted;
    },
    get isContentChangeStatus() {
      return currentState.isContentChangeStatus;
    },
    get isContentChangedStatus() {
      return currentState.isContentChangedStatus;
    },
    get $state() {
      return currentState;
    },
    reset(state: Partial<CoursesState> = initial) {
      innerStore.set({ ...initial, ...state });
    },
    setCourses(courses: Course[]) {
      innerStore.update((s) => ({ ...s, courses }));
    },
    setCourse(course: CourseDetail | null) {
      innerStore.update((s) => ({ ...s, course }));
    },
    setContent(content: CourseContent | null) {
      innerStore.update((s) => ({ ...s, content }));
    },
    setIsCourse(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourse: status }));
    },
    setIsContent(status: boolean) {
      innerStore.update((s) => ({ ...s, isContent: status }));
    },
    setIsCourseAdd(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseAdd: status }));
    },
    setIsCourseAdded(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseAdded: status }));
    },
    setIsCourseChange(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseChange: status }));
    },
    setIsCourseChanged(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseChanged: status }));
    },
    setIsCourseChangeCover(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseChangeCover: status }));
    },
    setIsCourseChangedCover(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseChangedCover: status }));
    },
    setIsCourseDelete(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseDelete: status }));
    },
    setIsCourseDeleted(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseDeleted: status }));
    },
    setIsCourseDeleteAll(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseDeleteAll: status }));
    },
    setIsCourseDeletedAll(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseDeletedAll: status }));
    },
    setIsStudentAdd(status: boolean) {
      innerStore.update((s) => ({ ...s, isStudentAdd: status }));
    },
    setIsStudentAdded(status: boolean) {
      innerStore.update((s) => ({ ...s, isStudentAdded: status }));
    },
    setIsStudentDelete(status: boolean) {
      innerStore.update((s) => ({ ...s, isStudentDelete: status }));
    },
    setIsStudentDeleted(status: boolean) {
      innerStore.update((s) => ({ ...s, isStudentDeleted: status }));
    },
    setIsRatingChange(status: boolean) {
      innerStore.update((s) => ({ ...s, isRatingChange: status }));
    },
    setIsRatingChanged(status: boolean) {
      innerStore.update((s) => ({ ...s, isRatingChanged: status }));
    },
    setIsContentAdd(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentAdd: status }));
    },
    setIsContentAdded(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentAdded: status }));
    },
    setIsContentChange(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentChange: status }));
    },
    setIsContentChanged(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentChanged: status }));
    },
    setIsContentDelete(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentDelete: status }));
    },
    setIsContentDeleted(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentDeleted: status }));
    },
    setIsContentChangeStatus(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentChangeStatus: status }));
    },
    setIsContentChangedStatus(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentChangedStatus: status }));
    },

    async asyncSetCourses(is_me: string | number = "") {
      try {
        const courses = await courseApi.getCourses(is_me);
        this.setCourses(courses);
      } catch {
        this.setCourses([]);
      }
    },

    async asyncSetCourse(courseId: string | number) {
      try {
        const course = await courseApi.getCourseById(courseId);
        this.setCourse(course);
      } catch {
        this.setCourse(null);
      } finally {
        this.setIsCourse(true);
      }
    },

    async asyncSetContent(contentId: string | number) {
      try {
        const content = await courseApi.getContentById(contentId);
        this.setContent(content);
      } catch {
        this.setContent(null);
      } finally {
        this.setIsContent(true);
      }
    },

    async asyncSetIsCourseAdd(title: string, description: string) {
      try {
        await courseApi.postCourse(title, description);
        showSuccessDialog("Kursus berhasil ditambahkan!");
        this.setIsCourseAdded(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseAdded(false);
      } finally {
        this.setIsCourseAdd(true);
      }
    },

    async asyncSetIsCourseChange(
      courseId: string | number,
      title: string,
      description: string
    ) {
      try {
        const message = await courseApi.putCourse(courseId, title, description);
        showSuccessDialog(message || "Kursus berhasil diperbarui!");
        this.setIsCourseChanged(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseChanged(false);
      } finally {
        this.setIsCourseChange(true);
      }
    },

    async asyncSetIsCourseChangeCover(courseId: string | number, cover: File) {
      try {
        const message = await courseApi.postCourseCover(courseId, cover);
        showSuccessDialog(message || "Cover berhasil diperbarui!");
        this.setIsCourseChangedCover(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseChangedCover(false);
      } finally {
        this.setIsCourseChangeCover(true);
      }
    },

    async asyncSetIsCourseDelete(courseId: string | number) {
      try {
        const message = await courseApi.deleteCourse(courseId);
        showSuccessDialog(message || "Kursus berhasil dihapus!");
        this.setIsCourseDeleted(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseDeleted(false);
      } finally {
        this.setIsCourseDelete(true);
      }
    },

    async asyncSetIsCourseDeleteAll() {
      try {
        const message = await courseApi.deleteAllCourses();
        showSuccessDialog(message || "Semua kursus berhasil dihapus!");
        this.setIsCourseDeletedAll(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseDeletedAll(false);
      } finally {
        this.setIsCourseDeleteAll(true);
      }
    },

    async asyncSetIsStudentAdd(courseId: string | number) {
      try {
        const message = await courseApi.postStudent(courseId);
        showSuccessDialog(message || "Berhasil mendaftar kursus!");
        this.setIsStudentAdded(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsStudentAdded(false);
      } finally {
        this.setIsStudentAdd(true);
      }
    },

    async asyncSetIsStudentDelete(courseId: string | number) {
      try {
        const message = await courseApi.deleteStudent(courseId);
        showSuccessDialog(message || "Berhasil keluar dari kursus!");
        this.setIsStudentDeleted(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsStudentDeleted(false);
      } finally {
        this.setIsStudentDelete(true);
      }
    },

    async asyncSetIsRatingChange(
      courseId: string | number,
      ratings: number,
      comment: string
    ) {
      try {
        const message = await courseApi.putStudentRating(courseId, ratings, comment);
        showSuccessDialog(message || "Rating berhasil disimpan!");
        this.setIsRatingChanged(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsRatingChanged(false);
      } finally {
        this.setIsRatingChange(true);
      }
    },

    async asyncSetIsContentAdd(
      courseId: string | number,
      title: string,
      youtube: string
    ) {
      try {
        await courseApi.postContent(courseId, title, youtube);
        showSuccessDialog("Materi konten berhasil ditambahkan!");
        this.setIsContentAdded(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsContentAdded(false);
      } finally {
        this.setIsContentAdd(true);
      }
    },

    async asyncSetIsContentChange(
      contentId: string | number,
      title: string,
      youtube: string
    ) {
      try {
        const message = await courseApi.putContent(contentId, title, youtube);
        showSuccessDialog(message || "Materi konten berhasil diperbarui!");
        this.setIsContentChanged(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsContentChanged(false);
      } finally {
        this.setIsContentChange(true);
      }
    },

    async asyncSetIsContentDelete(contentId: string | number) {
      try {
        const message = await courseApi.deleteContent(contentId);
        showSuccessDialog(message || "Materi konten berhasil dihapus!");
        this.setIsContentDeleted(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsContentDeleted(false);
      } finally {
        this.setIsContentDelete(true);
      }
    },

    async asyncSetIsContentChangeStatus(
      contentId: string | number,
      status: number
    ) {
      try {
        const message = await courseApi.postContentStatus(contentId, status);
        showSuccessDialog(message || "Status pembelajaran berhasil diubah!");
        this.setIsContentChangedStatus(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsContentChangedStatus(false);
      } finally {
        this.setIsContentChangeStatus(true);
      }
    },
  };
}

export const coursesStore = createCoursesStore();
export const useCoursesStore = () => coursesStore;
export default coursesStore;
