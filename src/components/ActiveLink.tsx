import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import cx from "classnames";
import { ReactNode } from "react";

interface Props extends LinkProps {
  className?: string;
  activeClassName?: string;
  children?: ReactNode;
  exact?: boolean;
}

export const ActiveLink = ({
  href,
  className,
  activeClassName,
  exact,
  children,
  ...props
}: Props) => {
  const router = useRouter();

  const isActive = exact
    ? router.pathname === href.toString()
    : router.pathname.startsWith(href.toString());

  return (
    <Link href={href} {...props}>
      <a className={cx(className, isActive && activeClassName)}>{children}</a>
    </Link>
  );
};
