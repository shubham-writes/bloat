import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const savings = searchParams.get("savings") ?? "0";
  const annual = searchParams.get("annual") ?? "0";
  const useCase = searchParams.get("useCase") ?? "team";
  const optimal = searchParams.get("optimal") === "true";

  const savingsNum = parseInt(savings, 10);
  const annualNum = parseInt(annual, 10);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#141210",
          padding: "60px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            backgroundColor: "#f04f23",
            display: "flex",
          }}
        />

        {/* Wordmark */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#ffb5a0",
            letterSpacing: "-0.02em",
            marginBottom: "auto",
            display: "flex",
          }}
        >
          BLOAT
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "auto",
          }}
        >
          {optimal ? (
            <>
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 800,
                  color: "#e5e2e1",
                  lineHeight: 1.1,
                  display: "flex",
                }}
              >
                Spending well
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "#e4beb4",
                  display: "flex",
                }}
              >
                No major optimizations found for this{" "}
                {useCase} stack.
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: 22,
                  color: "#ab8980",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  display: "flex",
                }}
              >
                Potential savings identified
              </div>
              <div
                style={{
                  fontSize: 96,
                  fontWeight: 800,
                  color: "#f04f23",
                  lineHeight: 1,
                  display: "flex",
                }}
              >
                ${savingsNum.toLocaleString()}/mo
              </div>
              <div
                style={{
                  fontSize: 28,
                  color: "#e4beb4",
                  display: "flex",
                }}
              >
                ${annualNum.toLocaleString()}/yr annualized — for a {useCase}{" "}
                team
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #353535",
            paddingTop: "24px",
          }}
        >
          <div style={{ fontSize: 18, color: "#ab8980", display: "flex" }}>
            Free AI spend audit — bloat.credex.rocks
          </div>
          <div
            style={{
              fontSize: 16,
              color: "#f04f23",
              display: "flex",
              backgroundColor: "#2c1a14",
              padding: "8px 20px",
              borderRadius: "6px",
            }}
          >
            Run your audit →
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
