import { Link as ERLink, Href } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { type ComponentProps } from "react";
import { Linking } from "react-native";

type Props = Omit<ComponentProps<typeof ERLink>, "href"> & {
  href: Href;
  browser?: "in-app" | "external";
  children: React.ReactNode;
};

const isExternalUrl = (href: Href): boolean => {
  if (typeof href !== "string") return false;
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("sms:")
  );
};

export function Link({ href, browser = "in-app", children, ...rest }: Props) {
  const isExternal = isExternalUrl(href);

  if (!isExternal) {
    return (
      <ERLink href={href} {...rest}>
        {children}
      </ERLink>
    );
  }

  return (
    <ERLink
      href={href}
      onPress={async (e) => {
        e.preventDefault();
        const url = typeof href === "string" ? href : "";
        if (browser === "in-app") {
          await openBrowserAsync(url);
        } else {
          Linking.openURL(url);
        }
      }}
      {...rest}
    >
      {children}
    </ERLink>
  );
}
