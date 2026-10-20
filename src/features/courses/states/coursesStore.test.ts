import { describe, it, expect, vi, beforeEach } from "vitest";
import coursesStore, { useCoursesStore } from "./coursesStore";
import courseApi from "../api/courseApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("coursesStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    coursesStore.reset();
  });

  it("should have initial state and hook export", () => {
    expect(coursesStore.courses).toEqual([]);
    expect(coursesStore.course).toBeNull();
    expect(coursesStore.content).toBeNull();
    expect(coursesStore.isCourse).toBe(false);
    expect(coursesStore.isContent).toBe(false);
    expect(coursesStore.isCourseAdd).toBe(false);
    expect(coursesStore.isCourseAdded).toBe(false);
    expect(coursesStore.isCourseChange).toBe(false);
    expect(coursesStore.isCourseChanged).toBe(false);
    expect(coursesStore.isCourseChangeCover).toBe(false);
    expect(coursesStore.isCourseChangedCover).toBe(false);
    expect(coursesStore.isCourseDelete).toBe(false);
    expect(coursesStore.isCourseDeleted).toBe(false);
    expect(coursesStore.isCourseDeleteAll).toBe(false);
    expect(coursesStore.isCourseDeletedAll).toBe(false);
    expect(coursesStore.isStudentAdd).toBe(false);
    expect(coursesStore.isStudentAdded).toBe(false);
    expect(coursesStore.isStudentDelete).toBe(false);
    expect(coursesStore.isStudentDeleted).toBe(false);
    expect(coursesStore.isRatingChange).toBe(false);
    expect(coursesStore.isRatingChanged).toBe(false);
    expect(coursesStore.isContentAdd).toBe(false);
    expect(coursesStore.isContentAdded).toBe(false);
    expect(coursesStore.isContentChange).toBe(false);
    expect(coursesStore.isContentChanged).toBe(false);
    expect(coursesStore.isContentDelete).toBe(false);
    expect(coursesStore.isContentDeleted).toBe(false);
    expect(coursesStore.isContentChangeStatus).toBe(false);
    expect(coursesStore.isContentChangedStatus).toBe(false);
    expect(coursesStore.$state).toBeDefined();
    expect(useCoursesStore()).toBe(coursesStore);
  });

  it("should test all setters and reset", () => {
    coursesStore.setCourses([{ id: 1, title: "Test" } as any]);
    expect(coursesStore.courses).toHaveLength(1);

    coursesStore.setCourse({ id: 1, title: "Test Detail" } as any);
    expect(coursesStore.course?.title).toBe("Test Detail");

    coursesStore.setContent({ id: 2, title: "Content" } as any);
    expect(coursesStore.content?.title).toBe("Content");

    coursesStore.setIsCourse(true);
    expect(coursesStore.isCourse).toBe(true);

    coursesStore.setIsContent(true);
    expect(coursesStore.isContent).toBe(true);

    coursesStore.setIsCourseAdd(true);
    coursesStore.setIsCourseAdded(true);
    expect(coursesStore.isCourseAdd).toBe(true);
    expect(coursesStore.isCourseAdded).toBe(true);

    coursesStore.setIsCourseChange(true);
    coursesStore.setIsCourseChanged(true);
    expect(coursesStore.isCourseChange).toBe(true);
    expect(coursesStore.isCourseChanged).toBe(true);

    coursesStore.setIsCourseChangeCover(true);
    coursesStore.setIsCourseChangedCover(true);
    expect(coursesStore.isCourseChangeCover).toBe(true);
    expect(coursesStore.isCourseChangedCover).toBe(true);

    coursesStore.setIsCourseDelete(true);
    coursesStore.setIsCourseDeleted(true);
    expect(coursesStore.isCourseDelete).toBe(true);
    expect(coursesStore.isCourseDeleted).toBe(true);

    coursesStore.setIsCourseDeleteAll(true);
    coursesStore.setIsCourseDeletedAll(true);
    expect(coursesStore.isCourseDeleteAll).toBe(true);
    expect(coursesStore.isCourseDeletedAll).toBe(true);

    coursesStore.setIsStudentAdd(true);
    coursesStore.setIsStudentAdded(true);
    expect(coursesStore.isStudentAdd).toBe(true);
    expect(coursesStore.isStudentAdded).toBe(true);

    coursesStore.setIsStudentDelete(true);
    coursesStore.setIsStudentDeleted(true);
    expect(coursesStore.isStudentDelete).toBe(true);
    expect(coursesStore.isStudentDeleted).toBe(true);

    coursesStore.setIsRatingChange(true);
    coursesStore.setIsRatingChanged(true);
    expect(coursesStore.isRatingChange).toBe(true);
    expect(coursesStore.isRatingChanged).toBe(true);

    coursesStore.setIsContentAdd(true);
    coursesStore.setIsContentAdded(true);
    expect(coursesStore.isContentAdd).toBe(true);
    expect(coursesStore.isContentAdded).toBe(true);

    coursesStore.setIsContentChange(true);
    coursesStore.setIsContentChanged(true);
    expect(coursesStore.isContentChange).toBe(true);
    expect(coursesStore.isContentChanged).toBe(true);

    coursesStore.setIsContentDelete(true);
    coursesStore.setIsContentDeleted(true);
    expect(coursesStore.isContentDelete).toBe(true);
    expect(coursesStore.isContentDeleted).toBe(true);

    coursesStore.setIsContentChangeStatus(true);
    coursesStore.setIsContentChangedStatus(true);
    expect(coursesStore.isContentChangeStatus).toBe(true);
    expect(coursesStore.isContentChangedStatus).toBe(true);

    coursesStore.reset();
    expect(coursesStore.courses).toEqual([]);
    expect(coursesStore.isCourseAdd).toBe(false);
  });

  describe("asyncSetCourses", () => {
    it("should set courses on success", async () => {
      vi.spyOn(courseApi, "getCourses").mockResolvedValue([{ id: 1, title: "Course" } as any]);
      await coursesStore.asyncSetCourses();
      expect(coursesStore.courses).toHaveLength(1);
    });

    it("should set empty array on error", async () => {
      vi.spyOn(courseApi, "getCourses").mockRejectedValue(new Error("Network Error"));
      await coursesStore.asyncSetCourses();
      expect(coursesStore.courses).toEqual([]);
    });
  });

  describe("asyncSetCourse", () => {
    it("should set course on success", async () => {
      vi.spyOn(courseApi, "getCourseById").mockResolvedValue({ id: 1, title: "Course Detail" } as any);
      await coursesStore.asyncSetCourse(1);
      expect(coursesStore.course?.title).toBe("Course Detail");
      expect(coursesStore.isCourse).toBe(true);
    });

    it("should set null on error", async () => {
      vi.spyOn(courseApi, "getCourseById").mockRejectedValue(new Error("Fail"));
      await coursesStore.asyncSetCourse(1);
      expect(coursesStore.course).toBeNull();
      expect(coursesStore.isCourse).toBe(true);
    });
  });

  describe("asyncSetContent", () => {
    it("should set content on success", async () => {
      vi.spyOn(courseApi, "getContentById").mockResolvedValue({ id: 5, title: "Content Detail" } as any);
      await coursesStore.asyncSetContent(5);
      expect(coursesStore.content?.title).toBe("Content Detail");
      expect(coursesStore.isContent).toBe(true);
    });

    it("should set null on error", async () => {
      vi.spyOn(courseApi, "getContentById").mockRejectedValue(new Error("Fail"));
      await coursesStore.asyncSetContent(5);
      expect(coursesStore.content).toBeNull();
      expect(coursesStore.isContent).toBe(true);
    });
  });

  describe("asyncSetIsCourseAdd", () => {
    it("should succeed and show success dialog", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "postCourse").mockResolvedValue({ course_id: 1 });

      await coursesStore.asyncSetIsCourseAdd("Title", "Desc");
      expect(coursesStore.isCourseAdded).toBe(true);
      expect(coursesStore.isCourseAdd).toBe(true);
      expect(showSuccess).toHaveBeenCalled();
    });

    it("should handle error and show error dialog", async () => {
      const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "postCourse").mockRejectedValue(new Error("Gagal tambah"));

      await coursesStore.asyncSetIsCourseAdd("Title", "Desc");
      expect(coursesStore.isCourseAdded).toBe(false);
      expect(coursesStore.isCourseAdd).toBe(true);
      expect(showError).toHaveBeenCalledWith("Gagal tambah");
    });
  });

  describe("asyncSetIsCourseChange", () => {
    it("should succeed and show success dialog", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "putCourse").mockResolvedValue("Berhasil");

      await coursesStore.asyncSetIsCourseChange(1, "Title", "Desc");
      expect(coursesStore.isCourseChanged).toBe(true);
      expect(coursesStore.isCourseChange).toBe(true);
      expect(showSuccess).toHaveBeenCalledWith("Berhasil");
    });

    it("should succeed with default message", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "putCourse").mockResolvedValue("");

      await coursesStore.asyncSetIsCourseChange(1, "Title", "Desc");
      expect(showSuccess).toHaveBeenCalledWith("Kursus berhasil diperbarui!");
    });

    it("should handle error and show error dialog", async () => {
      const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "putCourse").mockRejectedValue(new Error("Gagal ubah"));

      await coursesStore.asyncSetIsCourseChange(1, "Title", "Desc");
      expect(coursesStore.isCourseChanged).toBe(false);
      expect(coursesStore.isCourseChange).toBe(true);
      expect(showError).toHaveBeenCalledWith("Gagal ubah");
    });
  });

  describe("asyncSetIsCourseChangeCover", () => {
    it("should succeed and show success dialog", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "postCourseCover").mockResolvedValue("Cover updated");

      const file = new File([""], "c.jpg");
      await coursesStore.asyncSetIsCourseChangeCover(1, file);
      expect(coursesStore.isCourseChangedCover).toBe(true);
      expect(coursesStore.isCourseChangeCover).toBe(true);
      expect(showSuccess).toHaveBeenCalledWith("Cover updated");
    });

    it("should succeed with default message", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "postCourseCover").mockResolvedValue("");

      const file = new File([""], "c.jpg");
      await coursesStore.asyncSetIsCourseChangeCover(1, file);
      expect(showSuccess).toHaveBeenCalledWith("Cover berhasil diperbarui!");
    });

    it("should handle error and show error dialog", async () => {
      const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "postCourseCover").mockRejectedValue(new Error("Gagal cover"));

      const file = new File([""], "c.jpg");
      await coursesStore.asyncSetIsCourseChangeCover(1, file);
      expect(coursesStore.isCourseChangedCover).toBe(false);
      expect(coursesStore.isCourseChangeCover).toBe(true);
      expect(showError).toHaveBeenCalledWith("Gagal cover");
    });
  });

  describe("asyncSetIsCourseDelete", () => {
    it("should succeed and show success dialog", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "deleteCourse").mockResolvedValue("Deleted");

      await coursesStore.asyncSetIsCourseDelete(1);
      expect(coursesStore.isCourseDeleted).toBe(true);
      expect(coursesStore.isCourseDelete).toBe(true);
      expect(showSuccess).toHaveBeenCalledWith("Deleted");
    });

    it("should succeed with fallback message", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "deleteCourse").mockResolvedValue("");

      await coursesStore.asyncSetIsCourseDelete(1);
      expect(showSuccess).toHaveBeenCalledWith("Kursus berhasil dihapus!");
    });

    it("should handle error and show error dialog", async () => {
      const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "deleteCourse").mockRejectedValue(new Error("Gagal hapus"));

      await coursesStore.asyncSetIsCourseDelete(1);
      expect(coursesStore.isCourseDeleted).toBe(false);
      expect(coursesStore.isCourseDelete).toBe(true);
      expect(showError).toHaveBeenCalledWith("Gagal hapus");
    });
  });

  describe("asyncSetIsCourseDeleteAll", () => {
    it("should succeed and show success dialog", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "deleteAllCourses").mockResolvedValue("All deleted");

      await coursesStore.asyncSetIsCourseDeleteAll();
      expect(coursesStore.isCourseDeletedAll).toBe(true);
      expect(coursesStore.isCourseDeleteAll).toBe(true);
      expect(showSuccess).toHaveBeenCalledWith("All deleted");
    });

    it("should succeed with fallback message", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "deleteAllCourses").mockResolvedValue("");

      await coursesStore.asyncSetIsCourseDeleteAll();
      expect(showSuccess).toHaveBeenCalledWith("Semua kursus berhasil dihapus!");
    });

    it("should handle error and show error dialog", async () => {
      const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "deleteAllCourses").mockRejectedValue(new Error("Gagal hapus semua"));

      await coursesStore.asyncSetIsCourseDeleteAll();
      expect(coursesStore.isCourseDeletedAll).toBe(false);
      expect(coursesStore.isCourseDeleteAll).toBe(true);
      expect(showError).toHaveBeenCalledWith("Gagal hapus semua");
    });
  });

  describe("asyncSetIsStudentAdd", () => {
    it("should succeed and show success dialog", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "postStudent").mockResolvedValue("Student added");

      await coursesStore.asyncSetIsStudentAdd(1);
      expect(coursesStore.isStudentAdded).toBe(true);
      expect(coursesStore.isStudentAdd).toBe(true);
      expect(showSuccess).toHaveBeenCalledWith("Student added");
    });

    it("should succeed with fallback message", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "postStudent").mockResolvedValue("");

      await coursesStore.asyncSetIsStudentAdd(1);
      expect(showSuccess).toHaveBeenCalledWith("Berhasil mendaftar kursus!");
    });

    it("should handle error and show error dialog", async () => {
      const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "postStudent").mockRejectedValue(new Error("Gagal daftar"));

      await coursesStore.asyncSetIsStudentAdd(1);
      expect(coursesStore.isStudentAdded).toBe(false);
      expect(coursesStore.isStudentAdd).toBe(true);
      expect(showError).toHaveBeenCalledWith("Gagal daftar");
    });
  });

  describe("asyncSetIsStudentDelete", () => {
    it("should succeed and show success dialog", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "deleteStudent").mockResolvedValue("Left course");

      await coursesStore.asyncSetIsStudentDelete(1);
      expect(coursesStore.isStudentDeleted).toBe(true);
      expect(coursesStore.isStudentDelete).toBe(true);
      expect(showSuccess).toHaveBeenCalledWith("Left course");
    });

    it("should succeed with fallback message", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "deleteStudent").mockResolvedValue("");

      await coursesStore.asyncSetIsStudentDelete(1);
      expect(showSuccess).toHaveBeenCalledWith("Berhasil keluar dari kursus!");
    });

    it("should handle error and show error dialog", async () => {
      const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "deleteStudent").mockRejectedValue(new Error("Gagal keluar"));

      await coursesStore.asyncSetIsStudentDelete(1);
      expect(coursesStore.isStudentDeleted).toBe(false);
      expect(coursesStore.isStudentDelete).toBe(true);
      expect(showError).toHaveBeenCalledWith("Gagal keluar");
    });
  });

  describe("asyncSetIsRatingChange", () => {
    it("should succeed and show success dialog", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "putStudentRating").mockResolvedValue("Rating saved");

      await coursesStore.asyncSetIsRatingChange(1, 5, "Great");
      expect(coursesStore.isRatingChanged).toBe(true);
      expect(coursesStore.isRatingChange).toBe(true);
      expect(showSuccess).toHaveBeenCalledWith("Rating saved");
    });

    it("should succeed with fallback message", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "putStudentRating").mockResolvedValue("");

      await coursesStore.asyncSetIsRatingChange(1, 5, "Great");
      expect(showSuccess).toHaveBeenCalledWith("Rating berhasil disimpan!");
    });

    it("should handle error and show error dialog", async () => {
      const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "putStudentRating").mockRejectedValue(new Error("Gagal rating"));

      await coursesStore.asyncSetIsRatingChange(1, 5, "Great");
      expect(coursesStore.isRatingChanged).toBe(false);
      expect(coursesStore.isRatingChange).toBe(true);
      expect(showError).toHaveBeenCalledWith("Gagal rating");
    });
  });

  describe("asyncSetIsContentAdd", () => {
    it("should succeed and show success dialog", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "postContent").mockResolvedValue({ content_id: 10 });

      await coursesStore.asyncSetIsContentAdd(1, "Title", "https://youtu.be/abc");
      expect(coursesStore.isContentAdded).toBe(true);
      expect(coursesStore.isContentAdd).toBe(true);
      expect(showSuccess).toHaveBeenCalledWith("Materi konten berhasil ditambahkan!");
    });

    it("should handle error and show error dialog", async () => {
      const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "postContent").mockRejectedValue(new Error("Gagal content add"));

      await coursesStore.asyncSetIsContentAdd(1, "Title", "https://youtu.be/abc");
      expect(coursesStore.isContentAdded).toBe(false);
      expect(coursesStore.isContentAdd).toBe(true);
      expect(showError).toHaveBeenCalledWith("Gagal content add");
    });
  });

  describe("asyncSetIsContentChange", () => {
    it("should succeed and show success dialog", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "putContent").mockResolvedValue("Content updated");

      await coursesStore.asyncSetIsContentChange(10, "Title", "https://youtu.be/abc");
      expect(coursesStore.isContentChanged).toBe(true);
      expect(coursesStore.isContentChange).toBe(true);
      expect(showSuccess).toHaveBeenCalledWith("Content updated");
    });

    it("should succeed with fallback message", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "putContent").mockResolvedValue("");

      await coursesStore.asyncSetIsContentChange(10, "Title", "https://youtu.be/abc");
      expect(showSuccess).toHaveBeenCalledWith("Materi konten berhasil diperbarui!");
    });

    it("should handle error and show error dialog", async () => {
      const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "putContent").mockRejectedValue(new Error("Gagal content change"));

      await coursesStore.asyncSetIsContentChange(10, "Title", "https://youtu.be/abc");
      expect(coursesStore.isContentChanged).toBe(false);
      expect(coursesStore.isContentChange).toBe(true);
      expect(showError).toHaveBeenCalledWith("Gagal content change");
    });
  });

  describe("asyncSetIsContentDelete", () => {
    it("should succeed and show success dialog", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "deleteContent").mockResolvedValue("Content deleted");

      await coursesStore.asyncSetIsContentDelete(10);
      expect(coursesStore.isContentDeleted).toBe(true);
      expect(coursesStore.isContentDelete).toBe(true);
      expect(showSuccess).toHaveBeenCalledWith("Content deleted");
    });

    it("should succeed with fallback message", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "deleteContent").mockResolvedValue("");

      await coursesStore.asyncSetIsContentDelete(10);
      expect(showSuccess).toHaveBeenCalledWith("Materi konten berhasil dihapus!");
    });

    it("should handle error and show error dialog", async () => {
      const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "deleteContent").mockRejectedValue(new Error("Gagal content delete"));

      await coursesStore.asyncSetIsContentDelete(10);
      expect(coursesStore.isContentDeleted).toBe(false);
      expect(coursesStore.isContentDelete).toBe(true);
      expect(showError).toHaveBeenCalledWith("Gagal content delete");
    });
  });

  describe("asyncSetIsContentChangeStatus", () => {
    it("should succeed and show success dialog", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "postContentStatus").mockResolvedValue("Status changed");

      await coursesStore.asyncSetIsContentChangeStatus(10, 1);
      expect(coursesStore.isContentChangedStatus).toBe(true);
      expect(coursesStore.isContentChangeStatus).toBe(true);
      expect(showSuccess).toHaveBeenCalledWith("Status changed");
    });

    it("should succeed with fallback message", async () => {
      const showSuccess = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "postContentStatus").mockResolvedValue("");

      await coursesStore.asyncSetIsContentChangeStatus(10, 1);
      expect(showSuccess).toHaveBeenCalledWith("Status pembelajaran berhasil diubah!");
    });

    it("should handle error and show error dialog", async () => {
      const showError = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(courseApi, "postContentStatus").mockRejectedValue(new Error("Gagal status change"));

      await coursesStore.asyncSetIsContentChangeStatus(10, 1);
      expect(coursesStore.isContentChangedStatus).toBe(false);
      expect(coursesStore.isContentChangeStatus).toBe(true);
      expect(showError).toHaveBeenCalledWith("Gagal status change");
    });
  });
});
