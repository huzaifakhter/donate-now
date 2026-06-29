import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-section-gap bg-surface-container-lowest border-t border-outline-variant/30">
      <div className="flex flex-col items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-stack-lg">
        <div className="flex flex-col md:flex-row justify-between w-full items-center gap-stack-lg border-b border-outline-variant/20 pb-stack-lg">
          <div className="space-y-4 text-center md:text-left">
            <Link href="/" className="font-headline-sm text-headline-sm font-bold text-primary block">
              Donate Now
            </Link>
            <p className="text-body-sm text-on-surface-variant max-w-xs">
              Building a more generous world through technology and radical transparency.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-gutter gap-y-stack-sm">
            <Link href="#" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="#" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
              Safety
            </Link>
            <Link href="#" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
              Success Stories
            </Link>
            <Link href="#" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
              Help Center
            </Link>
            <Link href="#" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between w-full items-center gap-stack-md pt-stack-sm">
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-left">
            © 2024 Donate Now. Empowering collective action through radical transparency.
          </p>
          <div className="flex items-center gap-stack-md">
            <Link
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-xl">public</span>
            </Link>
            <Link
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-xl">mail</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
