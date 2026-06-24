import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link"
import { useEffect, useRef } from "react"
import styles from '../styles/Home.module.scss'
import { gsap, Power3 } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import ProgressBar from "../components/ProgressBar"
//pokemon assets
import ash from '../public/ash.png'
import pikatchu from '../public/pikatchu.gif'
import grass from '../public/grass.png'
import dialog from '../public/dialog.png'
import gotcha from "../public/gotcha.png"
import scroll from "../public/scroll.png"
import help from "../public/help.png"
import pokeball from '../public/pokeball.png'

export default function Home() {
  const skillsRef = useRef(null)
  const hiddenSection = useRef(null)
  //pokemon scene refs
  const pikatchuRef = useRef(null)
  const grassRef = useRef(null)
  const pokemonRef = useRef(null)
  const tilesRef = useRef(null)
  const dialogRef = useRef(null)
  const ashRef = useRef(null)
  const pokeballRef = useRef(null)
  const gotchaRef = useRef(null)
  const scrollRef = useRef(null)
  let pikatchuCaught = true
  const catchEm = () => {
    const throwBall = gsap.timeline();
    throwBall.to(pokeballRef.current, {
      x: pikatchuRef.current.offsetLeft - pokeballRef.current.offsetLeft,
      y: pikatchuRef.current.offsetTop - pokeballRef.current.offsetTop,
      rotation: '+=720',

      ease: Power3.linear,
      duration: 1.25
    })
    throwBall.to(pokeballRef.current, {
      x: pikatchuRef.current.offsetLeft - pokeballRef.current.offsetLeft - 100,
      y: pikatchuRef.current.offsetTop - pokeballRef.current.offsetTop + 100,
      ease: Power3.linear,
      rotateZ: -360,
      duration: 1.2,
    })
    throwBall.to(pikatchuRef.current, {
      skewX: 15,
      x: -100,
      y: 50,
      scale: 0.5,
      opacity: 0,
      duration: 2,
      onStart: () => {
        pikatchuRef.current.classList.add(styles.redFilter)
      }
    })
    throwBall.to(gotchaRef.current, {
      opacity: 1,
      scale: 1,
      onComplete: () => {
        //so that the screen wont get locked again
        pikatchuCaught = true
        document.body.classList.remove('locked')
        //display the rest of the page
        hiddenSection.current.classList.remove(styles.hidden)
        //restore header
        document.getElementById('header').classList.remove('transparent')
        //add timeline for the hidden section
        //(used this approach to avoid glitches when scrolling too fast)


      }
    })
    throwBall.to(scrollRef.current, {
      autoAlpha: 1,
      transform: "translate3d(-50%, -50%, 0px)",
      duration: 1.2
    })


    throwBall.play()
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })

    // Collect every tween we create so we can tear them (and their
    // ScrollTriggers) down on unmount — gsap.context() isn't available in 3.7.
    const tweens = []
    const add = (t) => { tweens.push(t); return t }

    // --- Intro entrance (plays once, not scroll-bound) ---
    const intro = gsap.timeline({ delay: 0.2 })
    intro
      .from("#title", {
        autoAlpha: 0,
        rotationX: 90,
        transformOrigin: "50% 50% -100px",
        duration: 1.3,
        ease: "power3.out",
      })
      .from("#me", {
        autoAlpha: 0,
        y: 20,
        duration: 0.9,
        ease: "power3.out",
      }, "-=0.5")

    // --- Reusable scroll reveal (one consistent, smooth pattern) ---
    const reveal = (target, { trigger, start = "top 85%", ...vars } = {}) =>
      add(gsap.from(target, {
        autoAlpha: 0,
        y: 50,
        duration: 0.9,
        ease: "power3.out",
        ...vars,
        scrollTrigger: {
          trigger: trigger || target,
          start,
          toggleActions: "play none none reverse",
        },
      }))

    // Experience: heading reveals, then each card animates as it scrolls in
    reveal("#experience > h1", { trigger: "#experience", start: "top 80%" })
    gsap.utils.toArray("#experience .exp-card").forEach((item) => {
      reveal(item, { trigger: item, start: "top 85%", x: -40, y: 40 })
      // Stagger the bullet points within each card for extra polish
      add(gsap.from(item.querySelectorAll("li"), {
        autoAlpha: 0,
        x: 20,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }))
    })

    // Education + Degree
    reveal("#education > h1", { trigger: "#education" })
    reveal("#education > p", { trigger: "#education", start: "top 80%" })
    reveal("#degree > h2", { trigger: "#degree" })
    reveal("#degree > p", { trigger: "#degree", start: "top 80%" })

    // Skills heading
    reveal("#skillsHeader", { trigger: "#skillsHeader", y: 40 })

    // Skill category labels — light fade-up as each scrolls in
    gsap.utils.toArray(".skillCat").forEach((label) => {
      reveal(label, { trigger: label, start: "top 88%", y: 24, duration: 0.6 })
    })

    // Skill tags — staggered pop-in per category row
    gsap.utils.toArray(".skillTagRow").forEach((row) => {
      add(gsap.from(row.children, {
        autoAlpha: 0,
        y: 18,
        scale: 0.85,
        duration: 0.5,
        ease: "back.out(1.7)",
        stagger: 0.05,
        scrollTrigger: {
          trigger: row,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }))
    })

    // Closing call-to-action
    reveal(".cta-section h1", { trigger: ".cta-section", y: 40 })

    //pokemon scene — only builds when the scene is actually rendered
    if (pokemonRef.current) {
      const pokemon = add(gsap.timeline())
      pokemon
        .from(pikatchuRef.current, {
          transform: "translate3d(-150vw, 0px, 0px)",
          filter: 'brightness(0.2)',
          scrollTrigger: {
            trigger: pokemonRef.current,
            start: '5% center',
            end: '28% center',
            scrub: 2,
            toggleActions: "play, reverse, play,reverse",
          }
        })
        .from(grassRef.current, {
          transform: "translate3d(-150vw, 0px, 0px)",
          scrollTrigger: {
            trigger: pokemonRef.current,
            start: '5% center',
            end: '28% center',
            scrub: 2,
            toggleActions: "play, reverse, play,reverse",
          }
        })
        .addLabel('start')

        .from(dialogRef.current, {
          transform: "translate3d(-150vw, 0px, 0px)",
          scrollTrigger: {
            trigger: pokemonRef.current,
            ease: Power3.easeIn,
            start: '20% center',
            end: 'center center',
            scrub: 4,
            toggleActions: "restart, reverse, play,reverse",
          }
        })
        .from(tilesRef.current, {
          transform: "translate3d(200vw, 0px, 0px)",
          scrollTrigger: {
            trigger: pokemonRef.current,
            ease: Power3.easeIn,
            start: '30% center',
            end: 'top top',
            scrub: 5,
            toggleActions: "restart, reverse, play,reverse",
          }
        })
        .from(ashRef.current, {
          transform: "translate3d(100vw, 0px, 0px)",
          scrollTrigger: {
            trigger: pokemonRef.current,
            ease: Power3.easeIn,
            start: '10% center',
            end: 'center center',
            scrub: 4,
            toggleActions: "restart, reverse, play,reverse",
          }
        })
        .from(pokeballRef.current, {
          y: '-100vh',
          scrollTrigger: {
            trigger: pokemonRef.current,
            ease: Power3.easeIn,
            start: '10% center',
            end: 'center center',
            scrub: 3,
            toggleActions: "restart, reverse, play,reverse",
          }
        })
    }

    // Recompute trigger positions once images/fonts/layout settle.
    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 400)

    return () => {
      clearTimeout(refreshId)
      intro.kill()
      tweens.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill()
        t.kill()
      })
    }
  }, [])

  return (
    <div className="container">
      <Head>
        <title>Wael Laataoui | Portfolio</title>
        <meta name="description" content="My personal portfolio" />
        <meta property="og:title" content="Wael Laataoui's Portfolio" />
        <meta property="og:description" content="My personal portfolio" />
        <meta property="og:url" content="https://www.waellaataoui.tn/" />
        <meta property="og:type" content="website" />

      </Head>
      <ProgressBar></ProgressBar>
      <section id="intro" className="section">
        <h1 id="title">wael<span className="-primary">.me()</span></h1>
        <div id="me">
          <p className="-primary">Wael Laataoui</p>
          <p className="-gray">Fullstack Engineer &middot; 4 years</p>
        </div>
      </section>
      <section id="experience" className="section">
        <div className="gap"></div>

        <h1 >Experience<span className="-primary">.all()</span></h1>

        <div className={styles.experience}>
          <div className={`${styles.experienceItem} exp-card`}>
            <h2>Fullstack Engineer <span className="-primary">@ Quicktext</span></h2>
            <p className="-gray">Nov 2023 – Present | Sousse, Tunisia</p>
            <ul>
              <li>Owned end-to-end feature delivery on a large-scale SaaS platform — scoping, designing, and shipping production-ready functionality across the full stack</li>
              <li>Built embeddable micro-frontend widgets deployed across 2,000+ hotels, cutting load times by 20% through caching, bundle optimization, and API tuning</li>
              <li>Developed backend services and APIs with Node.js and Laravel, including data modeling for customer-facing and partner-facing products</li>
              <li>Set up testing coverage with Jest, Playwright & React Testing Library across distributed frontend modules</li>
              <li>Actively used AI-assisted development workflows to accelerate iteration speed and reduce boilerplate</li>
            </ul>
          </div>

          <div className={`${styles.experienceItem} exp-card`}>
            <h2>Frontend Developer <span className="-primary">@ MENTZ GmbH</span></h2>
            <p className="-gray">Apr 2023 – Nov 2023 | Sousse, Tunisia</p>
            <ul>
              <li>Shipped feature-rich interfaces for large-scale public transport systems using React.js and REST APIs, with a focus on usability and data-heavy UI components</li>
              <li>Integrated backend APIs using React Query and smart caching patterns for responsive, performant data flows</li>
              <li>Contributed to Agile delivery cycles with emphasis on clean integration, code reviews, and collaborative feature ownership</li>
            </ul>
          </div>

          <div className={`${styles.experienceItem} exp-card`}>
            <h2>Frontend Developer <span className="-primary">@ Nxtya Agency</span></h2>
            <p className="-gray">Sep 2022 – Apr 2023 | Monastir, Tunisia</p>
            <ul>
              <li>Built SSR web applications with Next.js and Node.js, optimized for SEO, performance, and scalable frontend architecture</li>
              <li>Translated UI/UX designs into responsive, production-ready interfaces with pixel-perfect attention to detail</li>
              <li>Delivered across the full product lifecycle — planning, implementation, deployment, and post-release maintenance</li>
            </ul>
          </div>
        </div>
      </section>
      <section id="education" className="section">
        <div className="gap"></div>

        <h1>Education<span className="-primary">.all()</span></h1>
        <p className="-gray"> {`<Education showcase>`} </p>
      </section>
      <section id="degree" >
        <h2>Software Engineering Degree<span className="-primary">(2019-2022)</span></h2>
        <p className="-gray"> @ Higher Institute of Applied Science and Technology of Sousse </p>
      </section>
      <div className="gap"></div>

      <section ref={pokemonRef} id={styles.pokemon}>
        <div ref={tilesRef} id={styles.tiles}></div>
        <div ref={ashRef} id={styles.ash}>
          <Image src={ash} layout="fill" alt="tiles" ></Image>
        </div>
        <div ref={pikatchuRef} id={styles.pikatchu}>
          <Image src={pikatchu} layout="fill" alt="pikatchu" onClick={catchEm}  ></Image>
        </div>
        <div ref={grassRef} id={styles.grass}>
          <Image src={grass} layout="fill" alt="grass" ></Image>
        </div>
        <div ref={dialogRef} id={styles.dialog}>
          <Image src={dialog} layout="fill" alt="dialog" ></Image>
        </div>
        <div ref={pokeballRef} id={styles.pokeball} onClick={catchEm}>
          <Image src={pokeball} layout="fill" alt="pokeball" ></Image>
        </div>
        <div ref={gotchaRef} id={styles.gotcha}>
          <Image src={gotcha} layout="fill" alt="gotcha" ></Image>
        </div>
        <div ref={scrollRef} id={styles.scroll}>
          <Image src={scroll} layout="fill" alt="scroll" ></Image>
        </div>
        <div className="tooltip" id={styles.help}>
          <div className="left">
            <p>Click on the pokeball OR Pikachu</p>
            <i></i>
          </div>
          <Image src={help} layout="fill" alt="help" ></Image>

        </div>
      </section>
      <div ref={hiddenSection}>

        <section ref={skillsRef} id={styles.skills} className="section">
          <div className="gap"></div>
          <h1 id="skillsHeader" className="-primary">Skills</h1>
          <p className={`${styles.skillCategoryLabel} skillCat`}>Frontend</p>
          <div className={`${styles.skillTags} skillTagRow`}>
            {['Next.js', 'React.js', 'TypeScript', 'Redux', 'Tailwind CSS', 'SASS', 'React Query', 'Zustand', 'Electron.js', 'PWA', 'JavaScript (ES6+)'].map(s => (
              <span key={s} className={styles.tag}>{s}</span>
            ))}
          </div>

          <p className={`${styles.skillCategoryLabel} skillCat`}>Backend & Databases</p>
          <div className={`${styles.skillTags} skillTagRow`}>
            {['NestJS', 'Laravel', 'Node.js', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'WebSockets', 'Elasticsearch', 'REST APIs'].map(s => (
              <span key={s} className={styles.tag}>{s}</span>
            ))}
          </div>

          <p className={`${styles.skillCategoryLabel} skillCat`}>Testing & Quality</p>
          <div className={`${styles.skillTags} skillTagRow`}>
            {['Jest', 'Playwright', 'Cypress', 'React Testing Library', 'Storybook', 'Core Web Vitals'].map(s => (
              <span key={s} className={styles.tag}>{s}</span>
            ))}
          </div>
          <p className={`${styles.skillCategoryLabel} skillCat`}>Dev Tools & Workflow</p>
          <div className={`${styles.skillTags} skillTagRow`}>
            {['Git', 'Docker', 'CI/CD', 'Figma', 'N8N', 'Vite', 'Turbopack', 'AI-assisted dev', 'Agile / Scrum'].map(s => (
              <span key={s} className={styles.tag}>{s}</span>
            ))}
          </div>
        </section>
        <section className="section cta-section">
          <h1>Check out my <br></br> <span className="-primary work-link"><Link href="/work">selected works</Link> </span>
            for more details.</h1>
        </section>
      </div>

    </div>
  )
}
