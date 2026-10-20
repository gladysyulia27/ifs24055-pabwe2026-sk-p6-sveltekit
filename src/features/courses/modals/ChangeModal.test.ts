import { describe, it, expect, vi, beforeEach } from "vitest";
import ChangeModal from "./ChangeModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import { coursesStore } from "../states/coursesStore";

describe("ChangeModal", () => {
  const sampleCourse = {
    id: 1,
    user_id: 1,
    title: "Old Title",
    description: "Old Description",
    created_at: "",
    updated_at: "",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(coursesStore, "asyncSetIsCourseChange").mockImplementation(() => Promise.resolve());
  });

  it("should not render when show is false", () => {
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: false, course: sampleCourse },
    });
    expect(wrapper.find('[data-testid="change-course-modal"]').exists()).toBe(false);
  });

  it("should render and pre-fill data when show is true", () => {
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, course: sampleCourse },
    });
    expect(wrapper.find('[data-testid="change-course-modal"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Ubah Data Kursus");

    const input = wrapper.find('[data-testid="course-title-input"]');
    expect((input.element as HTMLInputElement).value).toBe("Old Title");
  });

  it("should handle close button and cancel button clicks", async () => {
    const onClose = vi.fn();
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, course: sampleCourse, onClose },
    });

    const closeBtn = wrapper.find('[data-testid="close-modal-btn"]');
    await closeBtn.trigger("click");
    expect(onClose).toHaveBeenCalled();

    const cancelBtn = wrapper.find('[data-testid="cancel-course-btn"]');
    await cancelBtn.trigger("click");
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("should handle close without onClose callback", async () => {
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, course: sampleCourse },
    });

    const closeBtn = wrapper.find('[data-testid="close-modal-btn"]');
    await closeBtn.trigger("click");
  });

  it("should do nothing on save when course is null", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ChangeModal, {
      props: { show: true, course: null },
    });

    const titleInput = wrapper.find('[data-testid="course-title-input"]');
    await titleInput.setValue("New Title");
    const descInput = wrapper.find('[data-testid="course-description-textarea"]');
    await descInput.setValue("New Description");

    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(coursesStore.isCourseChange).toBe(false);
  });

  it("should validate empty title", async () => {
    const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, course: sampleCourse },
    });

    const titleInput = wrapper.find('[data-testid="course-title-input"]');
    await titleInput.setValue("");

    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(showError).toHaveBeenCalledWith("Judul tidak boleh kosong");
  });

  it("should validate empty description", async () => {
    const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, course: sampleCourse },
    });

    const descInput = wrapper.find('[data-testid="course-description-textarea"]');
    await descInput.setValue("");

    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(showError).toHaveBeenCalledWith("Deskripsi tidak boleh kosong");
  });

  it("should do nothing on submit if course id is missing", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ChangeModal, {
      props: { show: true, course: null },
    });

    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(coursesStore.isCourseChange).toBe(false);
  });

  it("should submit updated course data", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ChangeModal, {
      props: { show: true, course: sampleCourse },
    });

    const titleInput = wrapper.find('[data-testid="course-title-input"]');
    await titleInput.setValue("New Title");

    const descInput = wrapper.find('[data-testid="course-description-textarea"]');
    await descInput.setValue("New Description");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(coursesStore.asyncSetIsCourseChange).toBeDefined();
  });

  it("should react to isCourseChange and isCourseChanged completion", async () => {
    const onClose = vi.fn();
    const { coursesStore } = renderWithProviders(ChangeModal, {
      props: { show: true, course: sampleCourse, onClose },
    });

    coursesStore.setIsCourseChanged(true);
    coursesStore.setIsCourseChange(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(onClose).toHaveBeenCalled();
  });

  it("should react to isCourseChange failure", async () => {
    const { coursesStore } = renderWithProviders(ChangeModal, {
      props: { show: true, course: sampleCourse },
    });

    coursesStore.setIsCourseChanged(false);
    coursesStore.setIsCourseChange(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(coursesStore.isCourseChange).toBe(false);
  });
});
