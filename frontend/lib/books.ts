export interface Book {
  title: string;
  author: string;
  note?: string;
  description: string[];
  cover: string;
  href: string;
}

export const BOOKS: Book[] = [
  {
    title: 'Living As Saints In Babylon',
    author: 'Femi Olawale',
    note: 'Foreword by Pastor E. A. Adeboye',
    description: [
      'Living As A Saint in Babylon is a bold, prophetic guide for believers determined to stay faithful in a world drowning in compromise, pressure, and shifting values. Drawing deep wisdom from the lives of Daniel and his companions, Pastor Femi Olawale reveals how Christians can thrive, excel, and influence culture without losing their identity in Christ.',
      'This book is a battle cry for every believer who refuses to bow to the spirit of Babylon. Through powerful insights on prayer, righteousness, the Holy Spirit, and the Blood of Jesus, readers will discover how to stand firm, live with conviction, and carry the values of Zion into every sphere of life.',
      'If you’re longing for clarity, courage, and spiritual strength in a confusing age, this book will ignite your faith and anchor your soul. A must-read for anyone who wants to live unshaken.',
    ],
    cover: '/living-as-saints-in-babylon.png',
    href: 'https://www.amazon.ca/dp/B0HLY4XYDH',
  },
];
