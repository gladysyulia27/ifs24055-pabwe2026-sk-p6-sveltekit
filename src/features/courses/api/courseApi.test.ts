import { describe, it, expect, vi, beforeEach } from "vitest";
import courseApi from "./courseApi";
import apiHelper from "../../../helpers/apiHelper";

describe("courseApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("postCourse", () => {
    it("should return course data on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { course_id: 1 },
        }),
      } as Response);

      const result = await courseApi.postCourse("Judul", "Deskripsi");
      expect(result).toEqual({ course_id: 1 });
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Validasi gagal",
        }),
      } as Response);

      await expect(courseApi.postCourse("", "")).rejects.toThrow("Validasi gagal");
    });

    it("should throw default error message on fail without message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as Response);

      await expect(courseApi.postCourse("", "")).rejects.toThrow("Gagal menambahkan kursus");
    });
  });

  describe("postCourseCover", () => {
    it("should return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah cover",
        }),
      } as Response);

      const file = new File(["test"], "sample.jpg", { type: "image/jpeg" });
      const message = await courseApi.postCourseCover(1, file);
      expect(message).toBe("Berhasil mengubah cover");
    });

    it("should handle file with empty name", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah cover",
        }),
      } as Response);

      const file = new File(["test"], "", { type: "image/jpeg" });
      Object.defineProperty(file, "name", { value: "" });
      const message = await courseApi.postCourseCover(1, file);
      expect(message).toBe("Berhasil mengubah cover");
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal upload",
        }),
      } as Response);

      const file = new File(["test"], "sample.jpg", { type: "image/jpeg" });
      await expect(courseApi.postCourseCover(1, file)).rejects.toThrow("Gagal upload");
    });

    it("should throw default message on fail without message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as Response);

      const file = new File(["test"], "sample.jpg", { type: "image/jpeg" });
      await expect(courseApi.postCourseCover(1, file)).rejects.toThrow("Gagal mengubah cover");
    });
  });

  describe("putCourse", () => {
    it("should return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah data",
        }),
      } as Response);

      const msg = await courseApi.putCourse(1, "Judul Baru", "Deskripsi Baru");
      expect(msg).toBe("Berhasil mengubah data");
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak valid",
        }),
      } as Response);

      await expect(courseApi.putCourse(1, "", "")).rejects.toThrow("Data tidak valid");
    });

    it("should throw default error message on fail without message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as Response);

      await expect(courseApi.putCourse(1, "", "")).rejects.toThrow("Gagal mengubah kursus");
    });
  });

  describe("getCourses", () => {
    it("should return courses list without is_me parameter", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { courses: [{ id: 1, title: "Course 1" }] },
        }),
      } as Response);

      const result = await courseApi.getCourses();
      expect(result).toHaveLength(1);
    });

    it("should return courses list with is_me parameter", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { courses: [{ id: 1, title: "Course 1" }] },
        }),
      } as Response);

      const result = await courseApi.getCourses("1");
      expect(result).toHaveLength(1);
    });

    it("should return empty array if data.courses is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: {},
        }),
      } as Response);

      const result = await courseApi.getCourses();
      expect(result).toEqual([]);
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal mengambil data",
        }),
      } as Response);

      await expect(courseApi.getCourses()).rejects.toThrow("Gagal mengambil data");
    });

    it("should throw default error on fail without message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as Response);

      await expect(courseApi.getCourses()).rejects.toThrow("Gagal mengambil data kursus");
    });
  });

  describe("getCourseById", () => {
    it("should return course detail on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { course: { id: 1, title: "Course 1" } },
        }),
      } as Response);

      const result = await courseApi.getCourseById(1);
      expect(result.id).toBe(1);
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Kursus tidak ditemukan",
        }),
      } as Response);

      await expect(courseApi.getCourseById(99)).rejects.toThrow("Kursus tidak ditemukan");
    });

    it("should throw default error on fail without message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as Response);

      await expect(courseApi.getCourseById(99)).rejects.toThrow("Gagal mengambil detail kursus");
    });
  });

  describe("deleteCourse", () => {
    it("should return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus data",
        }),
      } as Response);

      const msg = await courseApi.deleteCourse(1);
      expect(msg).toBe("Berhasil menghapus data");
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal menghapus",
        }),
      } as Response);

      await expect(courseApi.deleteCourse(1)).rejects.toThrow("Gagal menghapus");
    });

    it("should throw default error on fail without message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as Response);

      await expect(courseApi.deleteCourse(1)).rejects.toThrow("Gagal menghapus kursus");
    });
  });

  describe("deleteAllCourses", () => {
    it("should return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus semua data kursus",
        }),
      } as Response);

      const msg = await courseApi.deleteAllCourses();
      expect(msg).toBe("Berhasil menghapus semua data kursus");
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Unauthenticated.",
        }),
      } as Response);

      await expect(courseApi.deleteAllCourses()).rejects.toThrow("Unauthenticated.");
    });

    it("should throw default error on fail without message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as Response);

      await expect(courseApi.deleteAllCourses()).rejects.toThrow("Gagal menghapus semua kursus");
    });
  });

  describe("postStudent", () => {
    it("should return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menjadi pelajar pada kursus",
        }),
      } as Response);

      const msg = await courseApi.postStudent(1);
      expect(msg).toBe("Berhasil menjadi pelajar pada kursus");
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Sudah terdaftar",
        }),
      } as Response);

      await expect(courseApi.postStudent(1)).rejects.toThrow("Sudah terdaftar");
    });

    it("should throw default error on fail without message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as Response);

      await expect(courseApi.postStudent(1)).rejects.toThrow("Gagal mendaftar sebagai peserta kursus");
    });
  });

  describe("deleteStudent", () => {
    it("should return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil keluar sebagai pelajar pada kursus",
        }),
      } as Response);

      const msg = await courseApi.deleteStudent(1);
      expect(msg).toBe("Berhasil keluar sebagai pelajar pada kursus");
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Belum terdaftar",
        }),
      } as Response);

      await expect(courseApi.deleteStudent(1)).rejects.toThrow("Belum terdaftar");
    });

    it("should throw default error on fail without message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as Response);

      await expect(courseApi.deleteStudent(1)).rejects.toThrow("Gagal keluar sebagai peserta kursus");
    });
  });

  describe("putStudentRating", () => {
    it("should return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah ratings pada kursus",
        }),
      } as Response);

      const msg = await courseApi.putStudentRating(1, 5, "Bagus sekali!");
      expect(msg).toBe("Berhasil mengubah ratings pada kursus");
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Rating harus antara 1-5",
        }),
      } as Response);

      await expect(courseApi.putStudentRating(1, 0, "")).rejects.toThrow("Rating harus antara 1-5");
    });

    it("should throw default error on fail without message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as Response);

      await expect(courseApi.putStudentRating(1, 5, "")).rejects.toThrow("Gagal memberikan rating");
    });
  });

  describe("postContent", () => {
    it("should return data on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { content_id: 10 },
        }),
      } as Response);

      const res = await courseApi.postContent(1, "Pengenalan", "https://youtu.be/abc");
      expect(res).toEqual({ content_id: 10 });
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "URL tidak valid",
        }),
      } as Response);

      await expect(courseApi.postContent(1, "", "")).rejects.toThrow("URL tidak valid");
    });

    it("should throw default error on fail without message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as Response);

      await expect(courseApi.postContent(1, "", "")).rejects.toThrow("Gagal menambahkan konten");
    });
  });

  describe("putContent", () => {
    it("should return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah konten kursus",
        }),
      } as Response);

      const msg = await courseApi.putContent(10, "Pengenalan Update", "https://youtu.be/xyz");
      expect(msg).toBe("Berhasil mengubah konten kursus");
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Konten tidak ditemukan",
        }),
      } as Response);

      await expect(courseApi.putContent(999, "", "")).rejects.toThrow("Konten tidak ditemukan");
    });

    it("should throw default error on fail without message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as Response);

      await expect(courseApi.putContent(999, "", "")).rejects.toThrow("Gagal mengubah konten");
    });
  });

  describe("getContentById", () => {
    it("should return content on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { course_content: { id: 10, title: "Materi 1" } },
        }),
      } as Response);

      const content = await courseApi.getContentById(10);
      expect(content.id).toBe(10);
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Konten tidak ada",
        }),
      } as Response);

      await expect(courseApi.getContentById(999)).rejects.toThrow("Konten tidak ada");
    });

    it("should throw default error on fail without message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as Response);

      await expect(courseApi.getContentById(999)).rejects.toThrow("Gagal mengambil detail konten");
    });
  });

  describe("deleteContent", () => {
    it("should return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus konten kursus",
        }),
      } as Response);

      const msg = await courseApi.deleteContent(10);
      expect(msg).toBe("Berhasil menghapus konten kursus");
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal menghapus konten",
        }),
      } as Response);

      await expect(courseApi.deleteContent(10)).rejects.toThrow("Gagal menghapus konten");
    });

    it("should throw default error on fail without message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as Response);

      await expect(courseApi.deleteContent(10)).rejects.toThrow("Gagal menghapus konten");
    });
  });

  describe("postContentStatus", () => {
    it("should return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah status pembelajaran pada konten kursus",
        }),
      } as Response);

      const msg = await courseApi.postContentStatus(10, 1);
      expect(msg).toBe("Berhasil mengubah status pembelajaran pada konten kursus");
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Status tidak valid",
        }),
      } as Response);

      await expect(courseApi.postContentStatus(10, 2)).rejects.toThrow("Status tidak valid");
    });

    it("should throw default error on fail without message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as Response);

      await expect(courseApi.postContentStatus(10, 1)).rejects.toThrow("Gagal mengubah status pembelajaran");
    });
  });
});
