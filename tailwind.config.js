/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // '사용할클래스명': ['CSS에정의한폰트이름']
        'pretendard-bold': ['Pretendard-Bold'],
        'pretendard': ['Pretendard-Medium'],
      },
    },
  },
  plugins: [],
};
