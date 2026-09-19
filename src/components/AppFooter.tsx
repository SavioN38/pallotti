import { Link } from 'react-router-dom';
import { ArrowUpRight, Globe, Heart, Mail, MapPin, Phone, Smartphone } from 'lucide-react';

export function AppFooter() {
  return (
    <section id="contact" className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Link to="/" className="group flex items-center gap-3">
            <img
              src="images/school/logo.png"
              alt="Pallotti Hill Public School logo"
              className="h-10 w-10 rounded-full bg-white object-contain shadow-md transition-transform duration-500 group-hover:rotate-[360deg]"
            />
            <span className="font-serif text-xl text-[#173c46]">Pallotti Hill</span>
          </Link>
          <p className="mt-5 max-w-[300px] text-sm leading-6 text-[#5e757a]">
            A learning community for curious minds and kind hearts.
          </p>
          <div className="mt-6 flex flex-col gap-3.5 text-sm text-[#5e757a]">
            <a
              href="https://www.google.com/maps/place/Pallotti+Hill+Public+School/@11.3328464,75.9811996,1038m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3ba6422f9b23bb51:0xc604005e625cdca0!8m2!3d11.3328412!4d75.9837745!16s%2Fg%2F1tf6_cld?entry=ttu&g_ep=EgoyMDI2MDkxNi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 transition-colors hover:text-[#173c46]"
            >
              <MapPin size={16} className="mt-0.5 shrink-0 text-[#af8742]" />
              <span>Agastianmuzhi, Mukkam P.O, Kozhikode Dt - Kerala-India</span>
            </a>
            <div className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0 text-[#af8742]" />
              <div className="flex flex-wrap gap-x-2">
                <a href="tel:04952296677" className="transition-colors hover:text-[#173c46]">0495 229 66 77</a>,
                <a href="tel:04952298377" className="transition-colors hover:text-[#173c46]">0495 229 8377</a>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Smartphone size={16} className="shrink-0 text-[#af8742]" />
              <a href="tel:9447848489" className="transition-colors hover:text-[#173c46]">9447848489</a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="shrink-0 text-[#af8742]" />
              <a href="mailto:pallottihillpublicschool@gmail.com" className="transition-colors hover:text-[#173c46]">pallottihillpublicschool@gmail.com</a>
            </div>
            <div className="flex items-center gap-2.5">
              <Globe size={16} className="shrink-0 text-[#af8742]" />
              <a href="https://www.pallottihillmukkam.org" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#173c46]">www.pallottihillmukkam.org</a>
            </div>
          </div>
        </div>
        <div>
          <p className="footer-heading">Explore</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#5e757a]">
            <Link to="/#about-us" className="transition-colors hover:text-[#173c46]">About us</Link>
            <Link to="/#academics" className="transition-colors hover:text-[#173c46]">Academics</Link>
            <Link to="/#campus-life" className="transition-colors hover:text-[#173c46]">Campus life</Link>
            <Link to="/#events" className="transition-colors hover:text-[#173c46]">School calendar</Link>
            <Link to="/gallery/2025-26" className="transition-colors hover:text-[#173c46]">Photo gallery</Link>
          </div>
        </div>
        <div>
          <p className="footer-heading">Connect</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#5e757a]">
            <Link to="/#admissions" className="transition-colors hover:text-[#173c46]">Admissions</Link>
            <a href="#contact" className="flex items-center gap-2 transition-colors hover:text-[#173c46]">
              <Heart size={13} className="text-[#af8742]" /> Contact the school
            </a>
            <Link to="/#admissions" className="flex items-center gap-2 transition-colors hover:text-[#173c46]">
              <ArrowUpRight size={13} className="text-[#af8742]" /> Book a campus tour
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-14 flex flex-col justify-between gap-3 border-t border-[#cad5d2] pt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8da0a0] sm:flex-row">
        <span>© 2025 Pallotti Hill Public School</span>
        <span>Learning with purpose</span>
      </div>
    </section>
  );
}
