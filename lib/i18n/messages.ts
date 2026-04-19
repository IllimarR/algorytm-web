export const locales = ['et', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'et';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const months: Record<Locale, readonly string[]> = {
  et: [
    'jaanuar',
    'veebruar',
    'märts',
    'aprill',
    'mai',
    'juuni',
    'juuli',
    'august',
    'september',
    'oktoober',
    'november',
    'detsember',
  ],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
};

type Messages = {
  home: {
    tagline: string;
    hero: string;
    moreEpisodes: string;
    latestEpisodes: string;
    unavailable: string;
    noEpisodes: string;
  };
  episodes: {
    title: string;
    unavailable: string;
    noEpisodes: string;
  };
  filter: {
    from: string;
    to: string;
    fromMonth: string;
    fromYear: string;
    toMonth: string;
    toYear: string;
    countSuffix: string;
    emptyState: string;
    all: string;
    yearLabel: (year: number) => string;
  };
  metadata: {
    siteTitle: string;
    siteDescription: string;
    ogLocale: string;
    episodesTitle: string;
    episodesDescription: string;
  };
};

const dictionaries: Record<Locale, Messages> = {
  et: {
    home: {
      tagline: 'Eesti tehnikapodcast',
      hero: 'Vestlused tarkvarast, idufirmadest ja tehnoloogiast — eesti keeles.',
      moreEpisodes: 'Rohkem episoode',
      latestEpisodes: 'Viimased episoodid',
      unavailable: 'Episoodid ei ole saadaval — RSS-voog pole seadistatud.',
      noEpisodes: 'Episoode pole veel avaldatud.',
    },
    episodes: {
      title: 'Kõik episoodid',
      unavailable: 'Episoodid ei ole saadaval — RSS-voog pole seadistatud.',
      noEpisodes: 'Episoode pole veel avaldatud.',
    },
    filter: {
      from: 'Alates',
      to: 'Kuni',
      fromMonth: 'Alates kuu',
      fromYear: 'Alates aasta',
      toMonth: 'Kuni kuu',
      toYear: 'Kuni aasta',
      countSuffix: 'episoodi',
      emptyState: 'Valitud ajavahemikus episoode ei ole.',
      all: 'Kõik',
      yearLabel: (year: number) => `${year} aasta`,
    },
    metadata: {
      siteTitle: 'Algorütm — Eesti tehnikapodcast',
      siteDescription:
        'Algorütm on eestikeelne tehnikapodcast — räägime tarkvarast, idufirmadest ja digitaalsest maailmast.',
      ogLocale: 'et_EE',
      episodesTitle: 'Episoodid — Algorütm',
      episodesDescription: 'Kõik Algorütmi podcasti episoodid.',
    },
  },
  en: {
    home: {
      tagline: 'Estonian Tech Podcast',
      hero: 'Conversations about software, startups, and technology — in Estonian.',
      moreEpisodes: 'More Episodes',
      latestEpisodes: 'Latest Episodes',
      unavailable: 'Episodes unavailable — RSS feed not configured.',
      noEpisodes: 'No episodes published yet.',
    },
    episodes: {
      title: 'All Episodes',
      unavailable: 'Episodes unavailable — RSS feed not configured.',
      noEpisodes: 'No episodes published yet.',
    },
    filter: {
      from: 'From',
      to: 'To',
      fromMonth: 'From month',
      fromYear: 'From year',
      toMonth: 'To month',
      toYear: 'To year',
      countSuffix: 'episodes',
      emptyState: 'No episodes in selected date range.',
      all: 'All',
      yearLabel: (year: number) => `${year}`,
    },
    metadata: {
      siteTitle: 'Algorütm — Estonian Tech Podcast',
      siteDescription:
        'Algorütm is an Estonian tech podcast covering software, startups, and the digital world.',
      ogLocale: 'en_US',
      episodesTitle: 'Episodes — Algorütm',
      episodesDescription: 'All episodes of the Algorütm Estonian tech podcast.',
    },
  },
};

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}
