import React, { useEffect, useRef, useState } from "react";
import { FaHeart, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CategoryProducts({ categoryName, title }) {
  const { fetchWithAuth } = useAuth();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const scrollRef = useRef(null);
  const targetScroll = useRef(0);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const pointerTypeRef = useRef("mouse"); // track current pointer type

  useEffect(() => {
    loadProducts();
  }, [categoryName]);

  const loadProducts = async () => {
    try {
      const res = await fetchWithAuth("http://127.0.0.1:8000/api/products/");
      const data = await res.json();
      const filtered = data.filter((p) => p.category?.name === categoryName);
      setProducts(filtered);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // --- Pointer Events ---
  const handlePointerDown = (e) => {
    pointerTypeRef.current = e.pointerType;
    if (e.pointerType !== "mouse") return; // allow native scroll for touch
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handlePointerMove = (e) => {
    if (pointerTypeRef.current !== "mouse") return; // only drag with mouse
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    targetScroll.current = scrollLeft - walk;
  };

  const handlePointerUp = () => setIsDown(false);
  const handlePointerLeave = () => setIsDown(false);

  // Smooth easing scroll (desktop only)
  useEffect(() => {
    let frame;
    const smoothScroll = () => {
      if (scrollRef.current && pointerTypeRef.current === "mouse") {
        scrollRef.current.scrollLeft +=
          (targetScroll.current - scrollRef.current.scrollLeft) * 0.2;
      }
      frame = requestAnimationFrame(smoothScroll);
    };
    frame = requestAnimationFrame(smoothScroll);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="flex justify-center p-3">
      <div className="w-full max-w-6xl">
        {/* Title + See All */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title || categoryName}</h2>
          <button
            onClick={() => navigate(`/category/${categoryName}`)}
            className="flex items-center gap-1 text-sm font-medium text-violet-600 hover:underline"
          >
            See all <FaChevronRight size={12} />
          </button>
        </div>

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto py-3 select-none [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            cursor: pointerTypeRef.current === "mouse"
              ? isDown
                ? "grabbing"
                : "grab"
              : "auto",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        >
          {products.map((p) => (
            <div
              key={p.id}
              className="relative min-w-[178px] flex-shrink-0 snap-start rounded-lg border border-gray-300 p-2 shadow-md"
            >
              {/* Image + Wishlist */}
              <div className="relative mb-2 flex h-32 w-full items-center justify-center rounded bg-gray-100">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full max-h-40 w-auto object-contain"
                  />
                ) : (
                  <div className="flex h-32 w-full items-center justify-center rounded">
                    No Image
                  </div>
                )}
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className="absolute top-2 right-2"
                >
                  <FaHeart
                    size={16}
                    className={
                      wishlist.includes(p.id) ? "text-red-500" : "text-gray-400"
                    }
                  />
                </button>
              </div>

              {/* Name */}
              <h3 className="truncate text-sm font-semibold">{p.name}</h3>
              <p className="text-xs text-gray-500">{p.quantity}</p>

              {/* Price */}
              <div className="mt-1">
                {p.retail_price && p.retail_price > p.selling_price ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-md font-bold text-violet-600">
                      ₹{p.selling_price}
                    </span>
                    <span className="text-xs text-gray-500 line-through">
                      ₹{p.retail_price}
                    </span>
                    <span className="rounded bg-green-300/20 px-1 text-sm font-semibold text-green-600">
                      {Math.round(
                        ((p.retail_price - p.selling_price) /
                          p.retail_price) *
                          100
                      )}
                      % OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-md font-bold text-violet-600">
                    ₹{p.selling_price ?? "-"}
                  </span>
                )}
              </div>

              {/* Add Button */}
              <button
                className="mt-2 w-full rounded bg-violet-900 px-2 py-1 text-sm text-white hover:bg-violet-800"
                onClick={() => console.log("Add", p.id)}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryProducts;
