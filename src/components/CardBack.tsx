import cardBackImg from "@/assets/card-back.jpg";

/**
 * Poker card back — uses the uploaded card-back image with white border frame.
 */
const CardBack = () => (
  <div
    className="w-full h-full rounded-xl overflow-hidden"
    style={{
      background: "#fff",
      padding: "6px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
    }}
  >
    <div
      className="w-full h-full rounded-lg overflow-hidden"
      style={{
        backgroundImage: `url(${cardBackImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  </div>
);

export default CardBack;
