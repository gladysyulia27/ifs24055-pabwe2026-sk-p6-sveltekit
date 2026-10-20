import { describe, it, expect } from "vitest";
import { optimizeImage, optimizeSrcset } from "./imageHelper";

const COVER = "https://open-api.delcom.org/img/courses/cover/40_1792156948.png";
const ENCODED = encodeURIComponent(COVER);

describe("imageHelper", () => {
  describe("optimizeImage", () => {
    it("memakai image optimizer Vercel", () => {
      expect(optimizeImage(COVER, 640, "vercel")).toBe(
        `/_vercel/image?url=${ENCODED}&w=640&q=75`
      );
    });

    it("memakai image CDN Netlify", () => {
      expect(optimizeImage(COVER, 96, "netlify")).toBe(
        `/.netlify/images?url=${ENCODED}&w=96&q=75`
      );
    });

    it("mengembalikan URL asli saat optimizer tidak aktif", () => {
      expect(optimizeImage(COVER, 640, "none")).toBe(COVER);
    });

    it("tidak menyentuh URL non-Delcom, blob, atau URL tidak valid", () => {
      expect(optimizeImage("https://example.com/a.png", 64, "vercel")).toBe(
        "https://example.com/a.png"
      );
      expect(optimizeImage("blob:http://localhost/abc", 64, "vercel")).toBe(
        "blob:http://localhost/abc"
      );
      expect(optimizeImage("bukan-url", 64, "netlify")).toBe("bukan-url");
    });

    it("tidak mengoptimasi URL http biasa dari host Delcom", () => {
      const insecure = "http://open-api.delcom.org/img/a.png";
      expect(optimizeImage(insecure, 64, "vercel")).toBe(insecure);
    });

    it("memakai mode bawaan dari build", () => {
      expect(optimizeImage(COVER, 640)).toBe(
        optimizeImage(COVER, 640, IMAGE_OPTIMIZER)
      );
    });
  });

  describe("optimizeSrcset", () => {
    it("membuat srcset untuk setiap lebar", () => {
      expect(optimizeSrcset(COVER, [384, 640], "vercel")).toBe(
        `/_vercel/image?url=${ENCODED}&w=384&q=75 384w, /_vercel/image?url=${ENCODED}&w=640&q=75 640w`
      );
    });

    it("mengembalikan undefined bila tidak bisa dioptimasi", () => {
      expect(optimizeSrcset(COVER, [384], "none")).toBeUndefined();
      expect(
        optimizeSrcset("https://example.com/a.png", [384], "vercel")
      ).toBeUndefined();
    });

    it("memakai mode bawaan dari build", () => {
      expect(optimizeSrcset(COVER, [384, 640])).toBe(
        optimizeSrcset(COVER, [384, 640], IMAGE_OPTIMIZER)
      );
    });
  });
});
