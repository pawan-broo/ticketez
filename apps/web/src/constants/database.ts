import { stringToSlug } from '@/utils';

export interface DatabaseType {
  country: string;
  countryCode: string;
  states: StateData[];
}

export interface StateData {
  state: string;
  city: CityData[];
}

export interface CityData {
  city: string;
  monuments: MonumentOrMuseum[];
  museums: MonumentOrMuseum[];
}

export interface MonumentOrMuseum {
  name: string;
  slug: string;
  location: string;
  googleMapLink: string;
  images: string[];
  videos: string[];
  shortDesc: string;
  longDesc: string;
  precautionAndSafety: string[];
  metadata: MetaData[];
}

export interface MetaData {
  label: string;
  data: string;
}

export const Database: DatabaseType[] = [
  {
    country: 'India',
    countryCode: 'IN',
    states: [
      {
        state: 'Rajasthan',
        city: [
          {
            city: 'Jaipur',
            monuments: [
              {
                name: 'Amber Fort',
                slug: stringToSlug('Amber Fort'),
                location: 'Jaipur, Rajasthan, India, 302028',
                googleMapLink: 'https://goo.gl/maps/jn8W6QqDnkq',
                images: ['', '', '', '', ''],
                videos: [''],
                shortDesc:
                  'A majestic hilltop fort known for its artistic Hindu-style elements and Sheesh Mahal (Mirror Palace).',
                longDesc:
                  'Amber Fort, built by Raja Man Singh in 1592, showcases a blend of Hindu and Mughal architecture. It overlooks Maota Lake and is known for its intricate mirror work, frescoes, and grand courtyards. Visitors often enjoy the light and sound show that narrates its royal history.',
                precautionAndSafety: [
                  'Wear comfortable shoes as there is a lot of walking uphill.',
                  'Carry water and sun protection.',
                  'Beware of monkeys near the fort walls.',
                ],
                metadata: [
                  { label: 'Best Time to Visit', data: 'October to March' },
                  { label: 'Open Time', data: '8:00 AM' },
                  { label: 'Close Time', data: '5:30 PM' },
                  {
                    label: 'Entry Fees',
                    data: '₹100 (Indians), ₹500 (Foreigners)',
                  },
                  { label: 'Rush Hours', data: '10:00 AM - 1:00 PM' },
                  { label: 'Enquiry Number', data: '+91 141 2530293' },
                  {
                    label: 'Travel Mode',
                    data: 'Taxi, Auto-rickshaw, or Elephant Ride',
                  },
                  {
                    label: 'Nearby Places',
                    data: 'Jaigarh Fort, Nahargarh Fort, Jal Mahal',
                  },
                ],
              },
              {
                name: 'Hawa Mahal',
                slug: stringToSlug('Hawa Mahal'),
                location: 'Jaipur, Rajasthan, India, 302002',
                googleMapLink: 'https://goo.gl/maps/yTfn5UemYxT2',
                images: ['', '', '', '', ''],
                videos: [''],
                shortDesc:
                  'Iconic pink sandstone palace with 953 windows built for royal women to watch street festivities.',
                longDesc:
                  'Constructed in 1799 by Maharaja Sawai Pratap Singh, Hawa Mahal is an architectural marvel designed by Lal Chand Ustad. Its honeycomb structure allows natural ventilation, making it comfortable even during summers.',
                precautionAndSafety: [
                  'Avoid visiting during peak noon hours.',
                  'Keep hydrated; limited shade areas.',
                  'Respect photography rules inside galleries.',
                ],
                metadata: [
                  {
                    label: 'Best Time to Visit',
                    data: 'Early Morning or Sunset',
                  },
                  { label: 'Open Time', data: '9:00 AM' },
                  { label: 'Close Time', data: '4:30 PM' },
                  {
                    label: 'Entry Fees',
                    data: '₹50 (Indians), ₹200 (Foreigners)',
                  },
                  { label: 'Rush Hours', data: '11:00 AM - 2:00 PM' },
                  { label: 'Enquiry Number', data: '+91 141 2618862' },
                  {
                    label: 'Travel Mode',
                    data: 'Auto, Cab, or On Foot from City Palace',
                  },
                  {
                    label: 'Nearby Places',
                    data: 'City Palace, Jantar Mantar, Bapu Bazaar',
                  },
                ],
              },
              {
                name: 'City Palace',
                slug: stringToSlug('City Palace'),
                location: 'Jaipur, Rajasthan, India, 302002',
                googleMapLink: 'https://goo.gl/maps/WdA3oEtu5Dn',
                images: ['', '', '', '', ''],
                videos: [''],
                shortDesc:
                  'Residence of Jaipur’s royal family, combining Rajput, Mughal, and European architectural styles.',
                longDesc:
                  'Built between 1729 and 1732 by Maharaja Sawai Jai Singh II, the City Palace is a vast complex of courtyards, gardens, and buildings. Part of it still serves as the residence of the royal family, while the rest is a museum.',
                precautionAndSafety: [
                  'Avoid carrying large bags.',
                  'Follow photography restrictions in certain halls.',
                  'Book tickets online to skip queues.',
                ],
                metadata: [
                  { label: 'Best Time to Visit', data: 'October to March' },
                  { label: 'Open Time', data: '9:30 AM' },
                  { label: 'Close Time', data: '5:00 PM' },
                  {
                    label: 'Entry Fees',
                    data: '₹200 (Indians), ₹700 (Foreigners)',
                  },
                  { label: 'Rush Hours', data: '11:00 AM - 2:00 PM' },
                  { label: 'Enquiry Number', data: '+91 141 4088888' },
                  {
                    label: 'Travel Mode',
                    data: 'Cab, Auto, or Cycle Rickshaw',
                  },
                  {
                    label: 'Nearby Places',
                    data: 'Hawa Mahal, Jantar Mantar, Govind Dev Ji Temple',
                  },
                ],
              },
              {
                name: 'Jantar Mantar',
                slug: stringToSlug('Jantar Mantar'),
                location: 'Jaipur, Rajasthan, India, 302002',
                googleMapLink: 'https://goo.gl/maps/ZnJZBmZqGxn',
                images: ['', '', '', '', ''],
                videos: [''],
                shortDesc:
                  'A UNESCO World Heritage site and astronomical observatory built by Maharaja Jai Singh II.',
                longDesc:
                  'Jantar Mantar is an astronomical wonder with 19 architectural instruments that measure time, predict eclipses, and track celestial bodies. The Samrat Yantra, the world’s largest sundial, is its highlight.',
                precautionAndSafety: [
                  'Visit in the morning for better light.',
                  'Hire a guide for detailed explanations.',
                  'Avoid touching instruments.',
                ],
                metadata: [
                  { label: 'Best Time to Visit', data: 'November to March' },
                  { label: 'Open Time', data: '9:00 AM' },
                  { label: 'Close Time', data: '4:30 PM' },
                  {
                    label: 'Entry Fees',
                    data: '₹50 (Indians), ₹200 (Foreigners)',
                  },
                  { label: 'Rush Hours', data: '10:00 AM - 12:00 PM' },
                  { label: 'Enquiry Number', data: '+91 141 2610494' },
                  {
                    label: 'Travel Mode',
                    data: 'Auto, Walkable from City Palace',
                  },
                  {
                    label: 'Nearby Places',
                    data: 'City Palace, Hawa Mahal, Tripolia Bazaar',
                  },
                ],
              },
            ],
            museums: [
              {
                name: 'Albert Hall Museum',
                slug: stringToSlug('Albert Hall Museum'),
                location: 'Jaipur, Rajasthan, India, 302001',
                googleMapLink: 'https://goo.gl/maps/1dRM3dM5aV32',
                images: ['', '', '', '', ''],
                videos: [''],
                shortDesc:
                  'Rajasthan’s oldest museum featuring a rich collection of art, artifacts, and an Egyptian mummy.',
                longDesc:
                  'Built in 1887 by Sir Samuel Swinton Jacob, the Albert Hall Museum is a beautiful example of Indo-Saracenic architecture. It houses metal art, pottery, arms, musical instruments, and textiles from Rajasthan’s history.',
                precautionAndSafety: [
                  'Photography requires a separate ticket.',
                  'Avoid carrying food inside.',
                  'Use guided tours for better understanding.',
                ],
                metadata: [
                  { label: 'Best Time to Visit', data: 'October to February' },
                  { label: 'Open Time', data: '9:00 AM' },
                  { label: 'Close Time', data: '5:00 PM' },
                  {
                    label: 'Entry Fees',
                    data: '₹40 (Indians), ₹300 (Foreigners)',
                  },
                  { label: 'Rush Hours', data: '11:00 AM - 1:00 PM' },
                  { label: 'Enquiry Number', data: '+91 141 2570099' },
                  { label: 'Travel Mode', data: 'Bus, Auto, or Cab' },
                  {
                    label: 'Nearby Places',
                    data: 'Ram Niwas Garden, Jaipur Zoo, Bapu Bazaar',
                  },
                ],
              },
            ],
          },
          {
            city: 'Udaipur',
            monuments: [
              {
                name: 'City Palace Udaipur',
                slug: stringToSlug('City Palace Udaipur'),
                location: 'Udaipur, Rajasthan, India, 313001',
                googleMapLink: 'https://goo.gl/maps/v5EAXmE4YGH2',
                images: ['', '', '', '', ''],
                videos: [''],
                shortDesc:
                  'A majestic palace complex overlooking Lake Pichola, showcasing Mewar’s royal history.',
                longDesc:
                  'Built over 400 years, the City Palace of Udaipur blends Rajasthani and Mughal styles. It features balconies, towers, and cupolas overlooking the city and lakes, offering one of India’s most romantic views.',
                precautionAndSafety: [
                  'Use comfortable footwear.',
                  'Photography fees apply inside the museum.',
                  'Avoid weekends for large crowds.',
                ],
                metadata: [
                  { label: 'Best Time to Visit', data: 'October to March' },
                  { label: 'Open Time', data: '9:30 AM' },
                  { label: 'Close Time', data: '5:30 PM' },
                  {
                    label: 'Entry Fees',
                    data: '₹300 (Indians), ₹700 (Foreigners)',
                  },
                  { label: 'Rush Hours', data: '11:00 AM - 2:00 PM' },
                  { label: 'Enquiry Number', data: '+91 294 2419021' },
                  { label: 'Travel Mode', data: 'Cab, Auto, or Boat Ride' },
                  {
                    label: 'Nearby Places',
                    data: 'Lake Pichola, Jag Mandir, Bagore Ki Haveli',
                  },
                ],
              },
            ],
            museums: [],
          },
          {
            city: 'Jodhpur',
            monuments: [
              {
                name: 'Mehrangarh Fort',
                slug: stringToSlug('Mehrangarh Fort'),
                location: 'Jodhpur, Rajasthan, India, 342006',
                googleMapLink: 'https://goo.gl/maps/TDPYvzkkt9x',
                images: ['', '', '', '', ''],
                videos: [''],
                shortDesc:
                  'One of the largest forts in India, offering panoramic views of the Blue City.',
                longDesc:
                  'Built by Rao Jodha in 1459, Mehrangarh Fort stands 410 feet above the city and is enclosed by thick walls. Inside are palaces with intricate carvings and a museum showcasing royal artifacts, arms, and costumes.',
                precautionAndSafety: [
                  'Wear hats; open areas can get hot.',
                  'Photography allowed in most sections.',
                  'Avoid cliff edges during windy weather.',
                ],
                metadata: [
                  { label: 'Best Time to Visit', data: 'November to February' },
                  { label: 'Open Time', data: '9:00 AM' },
                  { label: 'Close Time', data: '5:30 PM' },
                  {
                    label: 'Entry Fees',
                    data: '₹200 (Indians), ₹600 (Foreigners)',
                  },
                  { label: 'Rush Hours', data: '10:00 AM - 1:00 PM' },
                  { label: 'Enquiry Number', data: '+91 291 2548790' },
                  { label: 'Travel Mode', data: 'Taxi, Tuk-tuk' },
                  {
                    label: 'Nearby Places',
                    data: 'Jaswant Thada, Umaid Bhawan Palace',
                  },
                ],
              },
            ],
            museums: [],
          },
          {
            city: 'Jaisalmer',
            monuments: [
              {
                name: 'Jaisalmer Fort',
                slug: stringToSlug('Jaisalmer Fort'),
                location: 'Jaisalmer, Rajasthan, India, 345001',
                googleMapLink: 'https://goo.gl/maps/L5Kq1DB3G4D2',
                images: ['', '', '', '', ''],
                videos: [''],
                shortDesc:
                  'A living fort made of golden sandstone, home to shops and ancient temples.',
                longDesc:
                  "Built in 1156 by Rawal Jaisal, Jaisalmer Fort is a UNESCO World Heritage site. It’s one of the few ‘living forts,’ housing about 4,000 residents. The fort glows golden during sunrise and sunset, earning it the name 'Sonar Quila'.",
                precautionAndSafety: [
                  'Wear sturdy shoes for cobbled streets.',
                  'Avoid peak afternoon heat.',
                  'Respect residential privacy inside the fort.',
                ],
                metadata: [
                  { label: 'Best Time to Visit', data: 'October to February' },
                  { label: 'Open Time', data: '9:00 AM' },
                  { label: 'Close Time', data: '6:00 PM' },
                  {
                    label: 'Entry Fees',
                    data: '₹50 (Indians), ₹250 (Foreigners)',
                  },
                  { label: 'Rush Hours', data: '11:00 AM - 3:00 PM' },
                  { label: 'Enquiry Number', data: '+91 2992 252347' },
                  { label: 'Travel Mode', data: 'Auto, Camel Safari, or Walk' },
                  {
                    label: 'Nearby Places',
                    data: 'Patwon Ki Haveli, Gadisar Lake',
                  },
                ],
              },
            ],
            museums: [],
          },
          {
            city: 'Bikaner',
            monuments: [
              {
                name: 'Junagarh Fort',
                slug: stringToSlug('Junagarh Fort'),
                location: 'Bikaner, Rajasthan, India, 334001',
                googleMapLink: 'https://goo.gl/maps/qMhwHMWN3Fq',
                images: ['', '', '', '', ''],
                videos: [''],
                shortDesc:
                  'One of the few major forts not built on a hill, showcasing intricate marble and red sandstone work.',
                longDesc:
                  'Built by Raja Rai Singh in 1589, Junagarh Fort houses beautiful palaces like Anup Mahal and Ganga Mahal. Its architecture reflects influences from Gujarat, Mughal, and Rajput styles.',
                precautionAndSafety: [
                  'Keep an eye on personal belongings.',
                  'Avoid touching ancient murals.',
                  'Hire local guides for deeper insight.',
                ],
                metadata: [
                  { label: 'Best Time to Visit', data: 'October to March' },
                  { label: 'Open Time', data: '10:00 AM' },
                  { label: 'Close Time', data: '4:30 PM' },
                  {
                    label: 'Entry Fees',
                    data: '₹100 (Indians), ₹300 (Foreigners)',
                  },
                  { label: 'Rush Hours', data: '11:00 AM - 2:00 PM' },
                  { label: 'Enquiry Number', data: '+91 151 2202297' },
                  { label: 'Travel Mode', data: 'Cab or Tuk-tuk' },
                  {
                    label: 'Nearby Places',
                    data: 'Lalgarh Palace, Gajner Palace',
                  },
                ],
              },
            ],
            museums: [],
          },
        ],
      },
    ],
  },
];
