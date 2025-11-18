/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 字體設定
      fontFamily: {
        sans: ['Noto Sans'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      // 文字大小 (同時設定預設行高)
      fontSize: {
        h1: [
          '2.25rem',
          { lineHeight: '2.5rem', letterSpacing: '-0.02em', fontWeight: '700' },
        ], // 36px
        h2: [
          '1.875rem',
          {
            lineHeight: '2.25rem',
            letterSpacing: '-0.01em',
            fontWeight: '700',
          },
        ], // 30px
        h3: [
          '1.5rem',
          { lineHeight: '2rem', letterSpacing: '-0.01em', fontWeight: '600' },
        ], // 24px
        h4: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }], // 20px
        h5: ['1.125rem', { lineHeight: '1.5rem', fontWeight: '500' }], // 18px
        h6: ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }], // 16px
      },
      colors: {
        // 主要品牌顏色
        primary: {
          DEFAULT: '#2b4f61', // 主要深藍綠色
          foreground: '#ffffff', // 主要按鈕/元素上的文字顏色
        },
        secondary: {
          DEFAULT: '#4d6b7a', // 次要，較柔和的藍灰色
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#eba92a', // 強調色 (金色)
          dark: '#e4960e', // 強調色的深色版本
          foreground: '#1b3947', // 強調色上的文字
        },

        // 背景顏色
        background: '#f7f2ed', // 主要背景 (暖米白)
        foreground: '#1b3947', // 背景上的主要文字顏色
        'background-alt': '#eee9e4', // 備用背景色

        // 卡片/彈出視窗顏色
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1b3947',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#1b3947',
        },

        // 文字顏色
        text: {
          DEFAULT: '#1b3947', // 主要文字 (近黑色)
          light: '#6c7275', // 次要文字 (灰色)
        },

        // 狀態顏色
        destructive: {
          DEFAULT: '#ed7161', // 危險/錯誤 (紅色)
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#28a745', // 成功 (綠色)
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#ffc107', // 警告 (黃色)
          foreground: '#1b3947',
        },

        // 其他 UI 元素
        border: '#d1d3e2', // 預設邊框
        input: '#ced4da', // 輸入框邊框
        ring: '#eba92a', // 焦點環顏色 (使用強調色)

        // 灰色系
        gray: {
          100: '#f8f9fa',
          200: '#f1f3f4',
          300: '#e9ecef',
          400: '#d1d3e2',
          500: '#b3c0c6',
          600: '#91a3ad',
          700: '#6c7275',
          800: '#5a5c69',
          900: '#372f29',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

module.exports = config
