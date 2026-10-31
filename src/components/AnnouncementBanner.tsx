export function AnnouncementBanner() {
  return (
    <div className="bg-gradient-gold text-primary border-b border-gold/40">
      <div className="container-prose py-2.5 text-center text-xs md:text-sm font-display tracking-wide">
        <span className="font-bold uppercase tracking-[0.2em] mr-2">Limited Time:</span>
        <span>Free Admissions Counseling Webinar on May 31st, register </span>
        <a
          href="https://forms.gle/iBKvDejGd6xNQMBE7"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-70 font-bold"
        >
          here
        </a>
        .
      </div>
    </div>
  );
}
