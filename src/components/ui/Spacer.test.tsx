import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Spacer } from "./Spacer";

describe("Spacer", () => {
  it("renders with the given height and data-year-from/data-year-to attributes", () => {
    const { getByTestId } = render(
      <Spacer height={200} dataYearFrom={2007} dataYearTo={2009} id="study:spacer:0" />,
    );
    const el = getByTestId("spacer");
    expect(el).toHaveAttribute("data-year-from", "2007");
    expect(el).toHaveAttribute("data-year-to", "2009");
    expect(el.style.height).toBe("200px");
  });

  it("renders whatever height it's given without omitting the element, even 0px (Spacer itself doesn't know about the same-year 80px floor — that lives in timelineScale.ts)", () => {
    const { getByTestId } = render(
      <Spacer height={0} dataYearFrom={2021} dataYearTo={2021} id="study:spacer:4" />,
    );
    const el = getByTestId("spacer");
    expect(el.style.height).toBe("0px");
    expect(el).toHaveAttribute("data-year-from", "2021");
    expect(el).toHaveAttribute("data-year-to", "2021");
  });

  it("does not render an internal border/line element", () => {
    const { getByTestId } = render(
      <Spacer height={100} dataYearFrom={2019} dataYearTo={2020} id="trade:spacer:2" />,
    );
    const el = getByTestId("spacer");
    expect(el.children).toHaveLength(0);
  });
});
