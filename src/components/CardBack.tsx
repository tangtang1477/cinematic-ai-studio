import cardBackImg from "@/assets/card-back-sm.webp";

const CardBack = () => (
  <img
    src={cardBackImg}
    alt="Card back"
    loading="eager"
    decoding="async"
    draggable={false}
    style={{
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "12px",
      pointerEvents: "none",
      userSelect: "none",
    }}
  />
);

export default CardBack;
