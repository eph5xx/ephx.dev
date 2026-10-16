import { PROFILE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="px-4 md:px-6">
      <div className="border-border text-muted-foreground border-t pt-6 text-sm">
        <p>
          &copy; {new Date().getFullYear()} {PROFILE.name}
        </p>
      </div>
    </footer>
  );
}
