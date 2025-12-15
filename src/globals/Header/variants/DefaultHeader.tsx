"use client";
import { HeartIcon, ShoppingBagIcon, UserIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

import { CMSLink } from "@/components/Link";
import { Logo } from "@/components/Logo/Logo";
import { Media } from "@/components/Media";
import { Link } from "@/i18n/routing";
import { type Header } from "@/payload-types";
import { useCartState } from "@/stores/CartStateStore";
import { useCart } from "@/stores/CartStore";
import { useWishListState } from "@/stores/WishListStateStore";
import { useWishList } from "@/stores/WishlistStore";
import { cn } from "@/utilities/cn";

import { Search } from "../components/Search";

export const DefaultHeader = ({ data, disableCart }: { data: Header; disableCart?: boolean }) => {
  const [isMenuOpened, setisMenuOpened] = useState(false);
  const [scrollValue, setScrollValue] = useState(0);
  const [scrollDown, setScrollDown] = useState(false);

  const toggleMenu = () => {
    setisMenuOpened((menuState) => !menuState);
    document.documentElement.classList.toggle("overflow-clip");
    document.documentElement.classList.toggle("overflow-y-clip");
  };

  const { toggleCart } = useCartState();
  const { cart } = useCart();

  // Calculate total quantity directly during render
  const totalQuantity = cart ? cart.reduce((acc, product) => acc + product.quantity, 0) : 0;

  const { toggleWishList } = useWishListState();
  const { wishlist } = useWishList();

  useEffect(() => {
    let lastScrollValue = 0;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (data.hideOnScroll) {
        if (scrollTop > lastScrollValue && scrollTop > 300) {
          setScrollDown(true);
        } else if (scrollTop < lastScrollValue) {
          setScrollDown(false);
        }
        lastScrollValue = scrollTop;
      }

      setScrollValue(scrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data.hideOnScroll]);

  const classes = cn(
    `sticky flex w-full top-0 justify-center md:px-12 transition-transform z-50`,
    `${data.hideOnScroll && scrollDown ? "-translate-y-full md:-translate-y-full" : ""}`,
  );

  return (
    <header className={classes} style={data.background ? { background: data.background } : {}}>
      <div
        className={`container relative flex w-full items-center py-6 lg:gap-8 ${scrollValue > 0 ? "scrolled" : ""} ${isMenuOpened ? "opened" : ""}`}
      >
        <Link href="/" className="mr-auto">
          {data.logo && typeof data.logo !== "string" && data.logo.url && data.logo.alt ? (
            <Media
              resource={data.logo}
              className={cn(isMenuOpened && "invert lg:invert-0", "-my-7 h-[88px] w-full max-w-37.5")}
              imgClassName="h-[88px] w-full max-w-37.5"
            />
          ) : (
            <Logo />
          )}
        </Link>
        <Search />
        <button
          aria-label="Toggle Menu"
          className="z-20 order-1 ml-8 flex flex-col items-end justify-center gap-[6px] lg:hidden"
          onClick={toggleMenu}
        >
          <div
            className={`h-[3px] w-7 rounded-full bg-white transition-transform ${isMenuOpened && "absolute top-1/2 -translate-y-1/2 rotate-45 invert"}`}
          />
          <div
            className={`h-[3px] w-[22px] rounded-full bg-white transition-opacity ${isMenuOpened && "opacity-0"}`}
          />
          <div
            className={`h-[3px] w-7 rounded-full bg-white transition-transform ${isMenuOpened && "absolute top-1/2 -translate-y-1/2 -rotate-45 invert"}`}
          />
        </button>
        <nav
          className={`absolute left-1/2 top-0 z-10 flex origin-bottom transition-opacity duration-300 lg:z-10 ${isMenuOpened ? "opacity-100" : "scale-y-0 opacity-0"} h-dvh w-screen -translate-x-1/2 flex-col items-start justify-between bg-white p-8 pb-16 md:p-12 lg:static lg:h-auto lg:w-fit lg:translate-x-0 lg:scale-100 lg:flex-row lg:bg-transparent lg:p-0 lg:opacity-100`}
        >
          <div className="flex flex-col items-start gap-12 pt-24 lg:flex-row lg:pt-0">
            {data.navItems?.map(({ link }, i) => {
              return <CMSLink key={i} {...link} appearance="link" className="text-black lg:text-white" />;
            })}
          </div>
        </nav>
        <div className="flex gap-5">
          <Link href="/account/orders" className="-m-2 cursor-pointer p-2">
            <UserIcon color="white" width={24} height={24} />
          </Link>
          {!disableCart && (
            <>
              <button onClick={toggleWishList} className="relative -m-2 cursor-pointer p-2">
                {wishlist && wishlist.length > 0 ? (
                  <span className="absolute right-0 top-0 flex aspect-square h-5 w-5 items-center justify-center rounded-full bg-main-600 text-xs text-white">
                    {wishlist.length}
                  </span>
                ) : (
                  ""
                )}
                <HeartIcon color="white" width={24} height={24} />
              </button>
              <button onClick={toggleCart} className="relative -m-2 cursor-pointer p-2">
                {totalQuantity && totalQuantity > 0 ? (
                  <span className="absolute right-0 top-0 flex aspect-square h-5 w-5 items-center justify-center rounded-full bg-main-600 text-xs text-white">
                    {totalQuantity}
                  </span>
                ) : (
                  ""
                )}
                <ShoppingBagIcon color="white" width={24} height={24} />
              </button>
            </>
          )}
        </div>
        <CMSLink className="ml-auto hidden md:flex" />
        <div className="backdrop_blur absolute left-1/2 -z-30 h-full w-full -translate-x-1/2" />
      </div>
    </header>
  );
};
