import cardBackImg from "@/assets/card-back.jpg";

const CardBack = () => (
  <div
    style={{
      position: "relative",
      width: "100%",
      height: "100%",
      borderRadius: "12px",
      overflow: "hidden",
      background: "#fff",
      padding: "6px",
      boxSizing: "border-box",
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      boxShadow:
        "0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
    }}
  >
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundImage: `url(${cardBackImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transform: "translateZ(0.1px)",
      }}
    >
      <img
        src={cardBackImg}
        alt="Card back"
        loading="eager"
        decoding="sync"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "translateZ(0.1px)",
        }}
      />
    </div>
  </div>
);

export default CardBack;
      }}
    />
  </div>
);

export default CardBack;
