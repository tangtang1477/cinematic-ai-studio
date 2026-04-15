import { forwardRef } from "react";
import CardBack from "./CardBack";

interface FlippableCardProps {
  front: React.ReactNode;
  /** 0 = full back, 1 = full front */
  showFront?: boolean;
}

/**
 * A card with two faces using CSS 3D transforms.
 * The parent controls rotation via wrapper transform — this component
 * just renders front/back with proper backface-visibility.
 */
const FlippableCard = forwardRef<HTMLDivElement, FlippableCardProps>(
  ({ front, showFront = true }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: "100%",
          aspectRatio: "3 / 4",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front face */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {front}
        </div>

        {/* Back face */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <CardBack />
        </div>
      </div>
    );
  },
);

FlippableCard.displayName = "FlippableCard";

export default FlippableCard;
