import React, { useContext } from "react";
import { CartContext } from "./CartContext";

export default function DeliveryOptions () {
  const { isDelivery, setIsDelivery } = useContext(CartContext);

  const handleDeliveryOptionChange = (event) => {
    setIsDelivery(event.target.value === "delivery");
  };

  return (
    <div>
      <h2>Opções de Entrega</h2>
      <div>
        <label>
          <input
            type="radio"
            value="delivery"
            checked={isDelivery}
            onChange={handleDeliveryOptionChange}
          />
          Entrega
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="pickup"
            checked={!isDelivery}
            onChange={handleDeliveryOptionChange}
          />
          Retirada
        </label>
      </div>
    </div>
  );
};


