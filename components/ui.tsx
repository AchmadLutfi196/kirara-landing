"use client";
import Link from "next/link";
import { asset } from "@/lib/data";
import { useId, cloneElement, isValidElement, type ReactNode } from "react";
export function Image({
  name,
  alt = "",
  className = "",
  ...props
}: {
  name: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <img
      src={asset(name)}
      alt={alt}
      className={"od-media " + className}
      {...props}
    />
  );
}
export function Button({
  children,
  onClick,
  disabled = false,
  type = "button",
  ...props
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  "aria-pressed"?: boolean;
}) {
  return (
    <button
      className="btn btn-primary"
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
export function Go({
  to,
  children,
  primary = false,
}: {
  to: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      className={"btn " + (primary ? "btn-primary" : "btn-secondary")}
      href={"/" + to}
    >
      {children}
    </Link>
  );
}
export function Heading({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <div className="muted">{children}</div>
      </div>
    </div>
  );
}
export function Guide({
  children,
  who = "sakera",
}: {
  children: ReactNode;
  who?: string;
}) {
  return (
    <div className="guide">
      <Image name={who} alt={who === "sakera" ? "Sakera" : "Marlena"} />
      <div>
        <strong>Kak {who === "sakera" ? "Sakera" : "Marlena"}</strong>
        <p>{children}</p>
      </div>
    </div>
  );
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const generatedId = useId();
  const control = isValidElement<{ id?: string }>(children) ? children : null;
  const id = control?.props.id || generatedId;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {control ? cloneElement(control, { id }) : children}
    </div>
  );
}

export function Icon({ name }: { name: "menu" | "star" }) {
  const paths = {
    menu: "M4 6h16M4 12h16M4 18h16",
    star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z",
  };
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
