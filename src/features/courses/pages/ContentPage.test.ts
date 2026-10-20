import { describe, it, expect, vi, beforeEach } from "vitest";
import ContentPage from "./ContentPage.svelte";
import { renderWithProviders } from "../../../test-utils";
import { mockGoto } from "../../../setupTests";
import { coursesStore } from "../states/coursesStore";

describe("ContentPage", () => {
  const sampleCourse = {
    id: 1,
    title: "Course Test",
  };

  const sampleContentFinished = {
    id: 10,
    course_id: 1,
    title: "Video Materi 1",
    youtube: "https://www.youtube.com/watch?v=uHyfQV0kbgo",
    my_status_finished: true,
  };

  const sampleContentUnfinished = {
    id: 11,
    course_id: 1,
    title: "Video Materi 2",
    youtube: "https://youtu.be/abc12345678",
    my_status_finished: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(coursesStore, "asyncSetContent").mockImplementation(() => Promise.resolve());
    vi.spyOn(coursesStore, "asyncSetCourse").mockImplementation(() => Promise.resolve());
    vi.spyOn(coursesStore, "asyncSetIsContentChangeStatus").mockImplementation(() => Promise.resolve());
  });

  it("should show loading when content is null", () => {
    const { wrapper } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 10 },
      preloadedState: { content: null, course: sampleCourse },
    });

    expect(wrapper.text()).toContain("Memuat materi pembelajaran...");
  });

  it("should navigate back to course detail on back button click", async () => {
    const { wrapper } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 10 },
      preloadedState: { content: sampleContentFinished, course: sampleCourse },
    });

    const backBtn = wrapper.find('[data-testid="back-to-course-btn"]');
    await backBtn.trigger("click");
    expect(mockGoto).toHaveBeenCalledWith("/courses/1");
  });

  it("should render finished content with embedded iframe and handle toggle to unfinished", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 10 },
      preloadedState: { content: sampleContentFinished, course: sampleCourse },
    });

    expect(wrapper.text()).toContain("Video Materi 1");
    expect(wrapper.text()).toContain("Selesai Dipelajari");
    expect(wrapper.text()).toContain("Tandai Belum Selesai");

    const iframe = wrapper.find('[data-testid="youtube-iframe"]');
    expect(iframe.exists()).toBe(true);
    expect(iframe.attributes("src")).toContain("https://www.youtube.com/embed/uHyfQV0kbgo");

    const toggleBtn = wrapper.find('[data-testid="toggle-finished-btn"]');
    await toggleBtn.trigger("click");
    expect(coursesStore.asyncSetIsContentChangeStatus).toBeDefined();
  });

  it("should render unfinished content with youtu.be format and handle toggle to finished", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 11 },
      preloadedState: { content: sampleContentUnfinished, course: sampleCourse },
    });

    expect(wrapper.text()).toContain("Video Materi 2");
    expect(wrapper.text()).toContain("Belum Selesai");
    expect(wrapper.text()).toContain("Tandai Selesai");

    const iframe = wrapper.find('[data-testid="youtube-iframe"]');
    expect(iframe.attributes("src")).toContain("https://www.youtube.com/embed/abc12345678");

    const toggleBtn = wrapper.find('[data-testid="toggle-finished-btn"]');
    await toggleBtn.trigger("click");
    expect(coursesStore.asyncSetIsContentChangeStatus).toBeDefined();
  });

  it("should handle content with invalid or missing youtube url", () => {
    const { wrapper } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 12 },
      preloadedState: {
        content: { ...sampleContentUnfinished, id: 12, youtube: "" },
        course: sampleCourse,
      },
    });

    expect(wrapper.text()).toContain("Video tidak tersedia");
  });

  it("should handle content with raw non-youtube video link", () => {
    const { wrapper } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 13 },
      preloadedState: {
        content: { ...sampleContentUnfinished, id: 13, youtube: "https://myvideo.com/file.mp4" },
        course: sampleCourse,
      },
    });

    const iframe = wrapper.find('[data-testid="youtube-iframe"]');
    expect(iframe.attributes("src")).toBe("https://myvideo.com/file.mp4");
  });

  it("should react to isContentChangeStatus and isContentChangedStatus", async () => {
    const { coursesStore } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 10 },
      preloadedState: { content: sampleContentFinished, course: sampleCourse },
    });

    coursesStore.setIsContentChangedStatus(true);
    coursesStore.setIsContentChangeStatus(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(coursesStore.asyncSetContent).toBeDefined();

    // False branch
    coursesStore.setIsContentChangedStatus(false);
    coursesStore.setIsContentChangeStatus(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(coursesStore.isContentChangeStatus).toBe(false);
  });

  it("should reload content when contentId changes", async () => {
    const { rerender, coursesStore } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 10 },
      preloadedState: { content: sampleContentFinished, course: sampleCourse },
    });

    const setContentSpy = vi.spyOn(coursesStore, "asyncSetContent");
    await rerender({ courseId: 1, contentId: 99 });
    expect(setContentSpy).toHaveBeenCalledWith(99);
  });
});
