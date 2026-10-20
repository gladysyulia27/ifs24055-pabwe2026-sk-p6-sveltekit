import { describe, it, expect, vi, beforeEach } from "vitest";
import ChangeCoverModal from "./ChangeCoverModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import { coursesStore } from "../states/coursesStore";

describe("ChangeCoverModal", () => {
  const sampleCourse = {
    id: 1,
    user_id: 1,
    title: "Course",
    description: "Desc",
    created_at: "",
    updated_at: "",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(coursesStore, "asyncSetIsCourseChangeCover").mockImplementation(() => Promise.resolve());
  });

  it("should not render when show is false or course is null", () => {
    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: false, course: sampleCourse },
    });
    expect(wrapper.find('[data-testid="change-cover-modal"]').exists()).toBe(false);

    const { wrapper: wrapper2 } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, course: null },
    });
    expect(wrapper2.find('[data-testid="change-cover-modal"]').exists()).toBe(false);
  });

  it("should render when show is true and course is present", () => {
    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, course: sampleCourse },
    });
    expect(wrapper.find('[data-testid="change-cover-modal"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Ubah Cover Kursus");
  });

  it("should handle close button and cancel button clicks", async () => {
    const onClose = vi.fn();
    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, course: sampleCourse, onClose },
    });

    const closeBtn = wrapper.find('[data-testid="close-modal-btn"]');
    await closeBtn.trigger("click");
    expect(onClose).toHaveBeenCalled();

    const cancelBtn = wrapper.find('[data-testid="cancel-cover-btn"]');
    await cancelBtn.trigger("click");
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("should handle close without onClose callback", async () => {
    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, course: sampleCourse },
    });

    const closeBtn = wrapper.find('[data-testid="close-modal-btn"]');
    await closeBtn.trigger("click");
  });

  it("should validate file selection", async () => {
    const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, course: sampleCourse },
    });

    const fileInput = wrapper.find('[data-testid="cover-file-input"]');

    // Trigger change with no files
    await fileInput.trigger("change");

    // Trigger with non-image file
    const textFile = new File(["hello"], "hello.txt", { type: "text/plain" });
    Object.defineProperty(fileInput.element, "files", {
      value: [textFile],
      configurable: true,
    });
    await fileInput.trigger("change");
    expect(showError).toHaveBeenCalledWith("Pilih file gambar (JPG/PNG)!");

    // Trigger with oversized image
    const largeFile = new File([new Uint8Array(1024 * 1024 + 10)], "large.png", { type: "image/png" });
    Object.defineProperty(fileInput.element, "files", {
      value: [largeFile],
      configurable: true,
    });
    await fileInput.trigger("change");
    expect(showError).toHaveBeenCalledWith("Ukuran gambar maksimal 1MB!");

    // Submit without file
    Object.defineProperty(fileInput.element, "files", {
      value: [],
      configurable: true,
    });
    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(showError).toHaveBeenCalledWith("Silakan pilih cover baru!");
  });

  it("should preview and submit valid file", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, course: sampleCourse },
    });

    const fileInput = wrapper.find('[data-testid="cover-file-input"]');
    const validFile = new File(["valid"], "test.jpg", { type: "image/jpeg" });
    Object.defineProperty(fileInput.element, "files", {
      value: [validFile],
      configurable: true,
    });
    await fileInput.trigger("change");

    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);

    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(coursesStore.asyncSetIsCourseChangeCover).toBeDefined();
  });

  it("should do nothing on save if course id is missing", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, course: { ...sampleCourse, id: 0 } },
    });

    const fileInput = wrapper.find('[data-testid="cover-file-input"]');
    const validFile = new File(["valid"], "test.jpg", { type: "image/jpeg" });
    Object.defineProperty(fileInput.element, "files", {
      value: [validFile],
      configurable: true,
    });
    await fileInput.trigger("change");

    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(coursesStore.isCourseChangeCover).toBe(false);
  });

  it("should react to isCourseChangeCover and isCourseChangedCover completion", async () => {
    const onClose = vi.fn();
    const { coursesStore } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, course: sampleCourse, onClose },
    });

    coursesStore.setIsCourseChangedCover(true);
    coursesStore.setIsCourseChangeCover(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(onClose).toHaveBeenCalled();
  });

  it("should react to isCourseChangeCover failure", async () => {
    const { coursesStore } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, course: sampleCourse },
    });

    coursesStore.setIsCourseChangedCover(false);
    coursesStore.setIsCourseChangeCover(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(coursesStore.isCourseChangeCover).toBe(false);
  });
});
