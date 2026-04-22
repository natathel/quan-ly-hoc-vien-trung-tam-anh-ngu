import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { LoginPage } from "./login-page";
import { LandingPage } from "@/components/landing/landing-page";

describe("role login pages", () => {
  it("renders login cards for student, teacher and admin users", () => {
    const markup = renderToStaticMarkup(<LoginPage />);

    expect(markup).toContain("Đăng nhập hệ thống");
    expect(markup).toContain("Học viên / phụ huynh");
    expect(markup).toContain("Giáo viên");
    expect(markup).toContain("Admin / điều hành");
    expect(markup).toContain('action="/student"');
    expect(markup).toContain('action="/teacher"');
    expect(markup).toContain('action="/admin"');
    expect(markup).toContain("Tài khoản demo");
    expect(markup).toContain("UI đăng nhập demo");
  });

  it("highlights the requested role-specific login page", () => {
    const studentMarkup = renderToStaticMarkup(<LoginPage defaultRole="student" />);
    const teacherMarkup = renderToStaticMarkup(<LoginPage defaultRole="teacher" />);
    const adminMarkup = renderToStaticMarkup(<LoginPage defaultRole="admin" />);

    expect(studentMarkup).toContain("Đang chọn cổng học viên / phụ huynh");
    expect(teacherMarkup).toContain("Đang chọn cổng giáo viên");
    expect(adminMarkup).toContain("Đang chọn cổng admin / điều hành");
  });

  it("points landing CTAs to role login pages before portals", () => {
    const markup = renderToStaticMarkup(<LandingPage />);

    expect(markup).toContain('href="/student/login"');
    expect(markup).toContain('href="/teacher/login"');
    expect(markup).toContain('href="/admin/login"');
  });
});
