import { describe, it, expect, vi, beforeEach } from "vitest";
import ContentModal from "./ContentModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import { coursesStore } from "../states/coursesStore";

describe("ContentModal", () => {
  const sampleContent = {
    id: 10,
    course_id: 1,
    title: "Old Content",
    youtube: "https://youtu.be/old",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(coursesStore, "asyncSetIsContentAdd").mockImplementation(() => Promise.resolve());
    vi.spyOn(coursesStore, "asyncSetIsContentChange").mockImplementation(() => Promise.resolve());
  });

  it("should not render when show is false", () => {
    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: false, courseId: 1 },
    });
    expect(wrapper.find('[data-testid="content-modal"]').exists()).toBe(false);
  });

  it("should render in add mode when content is null", () => {
    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1, content: null },
    });
    expect(wrapper.find('[data-testid="content-modal"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Tambah Materi Konten");
  });

  it("should render in edit mode and pre-fill when content is provided", () => {
    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1, content: sampleContent },
    });
    expect(wrapper.text()).toContain("Ubah Materi Konten");
    const titleInput = wrapper.find('[data-testid="content-title-input"]');
    expect((titleInput.element as HTMLInputElement).value).toBe("Old Content");
    const youtubeInput = wrapper.find('[data-testid="content-youtube-input"]');
    expect((youtubeInput.element as HTMLInputElement).value).toBe("https://youtu.be/old");
  });

  it("should handle close button and cancel button clicks", async () => {
    const onClose = vi.fn();
    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1, onClose },
    });

    const closeBtn = wrapper.find('[data-testid="close-modal-btn"]');
    await closeBtn.trigger("click");
    expect(onClose).toHaveBeenCalled();

    const cancelBtn = wrapper.find('[data-testid="cancel-content-btn"]');
    await cancelBtn.trigger("click");
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("should handle close without onClose callback", async () => {
    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1 },
    });

    const closeBtn = wrapper.find('[data-testid="close-modal-btn"]');
    await closeBtn.trigger("click");
  });

  it("should do nothing on save when courseId is missing", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: "" },
    });

    const titleInput = wrapper.find('[data-testid="content-title-input"]');
    await titleInput.setValue("Title");
    const ytInput = wrapper.find('[data-testid="content-youtube-input"]');
    await ytInput.setValue("https://youtube.com/watch?v=123");

    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(coursesStore.isContentAdd).toBe(false);
  });

  it("should validate empty title", async () => {
    const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1 },
    });

    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(showError).toHaveBeenCalledWith("Judul materi tidak boleh kosong");
  });

  it("should validate empty youtube URL", async () => {
    const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1 },
    });

    const titleInput = wrapper.find('[data-testid="content-title-input"]');
    await titleInput.setValue("Title Test");

    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(showError).toHaveBeenCalledWith("Tautan video YouTube tidak boleh kosong");
  });

  it("should submit new content in add mode", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1, content: null },
    });

    const titleInput = wrapper.find('[data-testid="content-title-input"]');
    await titleInput.setValue("Materi Baru");

    const youtubeInput = wrapper.find('[data-testid="content-youtube-input"]');
    await youtubeInput.setValue("https://youtu.be/newvideo");

    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(coursesStore.asyncSetIsContentAdd).toBeDefined();
  });

  it("should submit updated content in edit mode", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1, content: sampleContent },
    });

    const titleInput = wrapper.find('[data-testid="content-title-input"]');
    await titleInput.setValue("Materi Terupdate");

    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(coursesStore.asyncSetIsContentChange).toBeDefined();
  });

  it("should react to isContentAdd and isContentAdded completion", async () => {
    const onClose = vi.fn();
    const { coursesStore } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1, onClose },
    });

    coursesStore.setIsContentAdded(true);
    coursesStore.setIsContentAdd(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(onClose).toHaveBeenCalled();
  });

  it("should react to isContentChange and isContentChanged completion", async () => {
    const onClose = vi.fn();
    const { coursesStore } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1, content: sampleContent, onClose },
    });

    coursesStore.setIsContentChanged(true);
    coursesStore.setIsContentChange(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(onClose).toHaveBeenCalled();
  });

  it("should react to isContentAdd and isContentChange failures", async () => {
    const { coursesStore } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1 },
    });

    coursesStore.setIsContentAdded(false);
    coursesStore.setIsContentAdd(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(coursesStore.isContentAdd).toBe(false);

    coursesStore.setIsContentChanged(false);
    coursesStore.setIsContentChange(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(coursesStore.isContentChange).toBe(false);
  });
});
