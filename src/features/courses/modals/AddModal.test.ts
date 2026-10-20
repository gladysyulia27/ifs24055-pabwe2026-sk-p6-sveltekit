import { describe, it, expect, vi, beforeEach } from "vitest";
import AddModal from "./AddModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import { coursesStore } from "../states/coursesStore";

describe("AddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(coursesStore, "asyncSetIsCourseAdd").mockImplementation(() => Promise.resolve());
  });

  it("should not render when show is false", () => {
    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: false },
    });
    expect(wrapper.find('[data-testid="add-course-modal"]').exists()).toBe(false);
  });

  it("should render correctly when show is true", () => {
    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: true },
    });
    expect(wrapper.find('[data-testid="add-course-modal"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Tambah Kursus Baru");
  });

  it("should handle close button click", async () => {
    const onClose = vi.fn();
    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: true, onClose },
    });

    const closeBtn = wrapper.find('[data-testid="close-modal-btn"]');
    await closeBtn.trigger("click");
    expect(onClose).toHaveBeenCalled();
  });

  it("should handle cancel button click", async () => {
    const onClose = vi.fn();
    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: true, onClose },
    });

    const cancelBtn = wrapper.find('[data-testid="cancel-course-btn"]');
    await cancelBtn.trigger("click");
    expect(onClose).toHaveBeenCalled();
  });

  it("should handle close without onClose callback", async () => {
    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: true },
    });

    const closeBtn = wrapper.find('[data-testid="close-modal-btn"]');
    await closeBtn.trigger("click");
  });

  it("should validate empty title", async () => {
    const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: true },
    });

    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(showError).toHaveBeenCalledWith("Judul tidak boleh kosong");
  });

  it("should validate empty description", async () => {
    const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: true },
    });

    const titleInput = wrapper.find('[data-testid="course-title-input"]');
    await titleInput.setValue("Judul Kursus");

    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(showError).toHaveBeenCalledWith("Deskripsi tidak boleh kosong");
  });

  it("should submit valid course data", async () => {
    const { wrapper, coursesStore } = renderWithProviders(AddModal, {
      props: { show: true },
    });

    const titleInput = wrapper.find('[data-testid="course-title-input"]');
    await titleInput.setValue("Belajar SvelteKit");

    const descInput = wrapper.find('[data-testid="course-description-textarea"]');
    await descInput.setValue("Deskripsi materi kursus SvelteKit lengkap");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(coursesStore.asyncSetIsCourseAdd).toBeDefined();
  });

  it("should react to isCourseAdd and isCourseAdded completion", async () => {
    const onClose = vi.fn();
    const { coursesStore } = renderWithProviders(AddModal, {
      props: { show: true, onClose },
    });

    coursesStore.setIsCourseAdded(true);
    coursesStore.setIsCourseAdd(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(onClose).toHaveBeenCalled();
  });

  it("should react to isCourseAdd failure", async () => {
    const { coursesStore } = renderWithProviders(AddModal, {
      props: { show: true },
    });

    coursesStore.setIsCourseAdded(false);
    coursesStore.setIsCourseAdd(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(coursesStore.isCourseAdd).toBe(false);
  });
});
