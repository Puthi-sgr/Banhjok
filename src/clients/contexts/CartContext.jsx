import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getFoodStock } from "../utils/food";

const CartContext = createContext(undefined);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id && item.userId === action.payload.userId
      );

      const stockLimit = existingItem
        ? getFoodStock(existingItem)
        : getFoodStock(action.payload);

      if (stockLimit <= 0) {
        return state;
      }

      if (existingItem) {
        if (existingItem.quantity >= stockLimit) {
          return state;
        }

        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id &&
            item.userId === action.payload.userId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.id === action.payload.id &&
              item.userId === action.payload.userId
            )
        ),
      };
    case "UPDATE_QUANTITY": {
      return {
        ...state,
        items: state.items
          .map((item) => {
            if (
              item.id === action.payload.id &&
              item.userId === action.payload.userId
            ) {
              const stockLimit = getFoodStock(item);

              if (stockLimit <= 0) {
                return null;
              }

              const normalizedQuantity = Math.min(
                Math.max(action.payload.quantity, 0),
                stockLimit
              );

              if (normalizedQuantity <= 0) {
                return null;
              }

              return { ...item, quantity: normalizedQuantity };
            }

            return item;
          })
          .filter(Boolean),
      };
    }
    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };
    case "LOAD_CART":
      return {
        ...state,
        items: action.payload,
      };
    case "CLEAR_USER_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.userId !== action.payload),
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Load cart from localStorage on mount and when user changes
  useEffect(() => {
    if (!user) {
      // Clear cart when no user is authenticated
      dispatch({ type: "CLEAR_CART" });
      return;
    }

    const savedCart = localStorage.getItem("banhjok-cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Filter items for the current user
        const userCartItems = parsedCart.filter(
          (item) => item.userId === user.id
        );
        dispatch({ type: "LOAD_CART", payload: userCartItems });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      // Get all cart items from localStorage
      const savedCart = localStorage.getItem("banhjok-cart");
      let allCartItems = [];

      if (savedCart) {
        try {
          allCartItems = JSON.parse(savedCart);
        } catch (error) {
          console.error("Error parsing saved cart:", error);
          allCartItems = [];
        }
      }

      // Remove items for current user and add current user's items
      const otherUsersItems = allCartItems.filter(
        (item) => item.userId !== user.id
      );
      const updatedCart = [...otherUsersItems, ...state.items];

      localStorage.setItem("banhjok-cart", JSON.stringify(updatedCart));
    }
  }, [state.items, user]);

  const addItem = (food) => {
    if (!user) {
      console.error("User must be authenticated to add items to cart");
      return;
    }

    const stockCount = getFoodStock(food);
    if (stockCount <= 0) {
      console.warn("Cannot add out-of-stock item to cart");
      return;
    }

    const existingItem = state.items.find(
      (item) => item.id === food.id && item.userId === user.id
    );

    if (existingItem && existingItem.quantity >= stockCount) {
      console.warn("Cannot add more than available stock");
      return;
    }

    dispatch({ type: "ADD_ITEM", payload: { ...food, userId: user.id } });
  };

  const removeItem = (id) => {
    if (!user) {
      console.error("User must be authenticated to remove items from cart");
      return;
    }
    dispatch({ type: "REMOVE_ITEM", payload: { id, userId: user.id } });
  };

  const updateQuantity = (id, quantity) => {
    if (!user) {
      console.error("User must be authenticated to update cart");
      return;
    }

    const cartItem = state.items.find(
      (item) => item.id === id && item.userId === user.id
    );

    if (!cartItem) {
      return;
    }

    const stockCount = getFoodStock(cartItem);
    let normalizedQuantity = Math.max(0, quantity);

    if (stockCount <= 0) {
      normalizedQuantity = 0;
    } else {
      normalizedQuantity = Math.min(normalizedQuantity, stockCount);
    }

    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id, quantity: normalizedQuantity, userId: user.id },
    });
  };

  const clearCart = () => {
    if (!user) {
      console.error("User must be authenticated to clear cart");
      return;
    }
    dispatch({ type: "CLEAR_USER_CART", payload: user.id });
  };

  const getTotalPrice = () => {
    return state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getDeliveryFee = () => {
    return 0;
  };

  const getTax = () => {
    return 0;
  };

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getDeliveryFee,
        getTax,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
