"use client";

import type { Ref, ReactNode } from "react";
import NextLink from "next/link";
import { Link as HeroLink } from "@heroui/react";

export function HeroRouteLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <HeroLink
      href={href}
      className={className}
      render={({ ref, ...domProps }) => (
        <NextLink {...domProps} href={href} ref={ref as Ref<HTMLAnchorElement>} />
      )}
    >
      {children}
    </HeroLink>
  );
}
