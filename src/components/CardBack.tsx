import cardBackImg from "@/assets/card-back.jpg";

/**
 * Poker card back — uses <img> for reliable rendering inside 3D contexts.
 */
const CardBack = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      borderRadius: "12px",
      overflow: "hidden",
      background: "#fff",
      padding: "6px",
      boxShadow:
        "0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
    }}
  >
    <img
      src={cardBackImg}
      alt="Card back"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "8px",
        display: "block",
      }}
    />
  </div>
);

export default CardBack;
