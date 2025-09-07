# HomeCanvas - AI Interior Designer

**Tagline:** "Your AI Interior Designer. Stop guessing, start visualizing."

A modern React web application that allows users to upload room photos and use natural language to describe interior design changes they want to make.

## Features

- 📸 **Image Upload**: Drag-and-drop or click to upload room photos
- ✍️ **Natural Language Input**: Describe changes in plain English
- ✨ **AI-Powered Generation**: Mock AI processing with realistic loading states
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🎨 **Modern UI**: Clean, professional interior design aesthetic
- 📚 **Design History**: Keep track of generated variations

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast development and build tool
- **React Router** - Client-side routing
- **PropTypes** - Runtime type checking
- **Modern CSS** - Custom CSS with CSS variables

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd homecanvas
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── ImageUpload.jsx      # Drag-and-drop file upload
│   ├── ImageDisplay.jsx     # Image viewer with loading states
│   ├── PromptInput.jsx      # Text input for design prompts
│   └── LoadingSpinner.jsx   # Reusable loading component
├── pages/
│   ├── Home.jsx            # Landing page
│   └── Editor.jsx          # Main editing interface
├── hooks/
│   └── useImageState.js    # Custom hook for image state management
├── utils/
│   └── imageUtils.js       # Image validation and utilities
├── App.jsx                 # Main app component with routing
├── main.jsx               # React entry point
└── index.css              # Global styles and CSS variables
```

## Key Components

### ImageUpload
- Drag-and-drop functionality
- File type and size validation
- Error handling and user feedback

### ImageDisplay
- Responsive image viewer
- Loading overlay during generation
- Generated image indicators

### PromptInput
- Character counter (500 max)
- Keyboard shortcuts (Ctrl/Cmd + Enter)
- Helpful tips for better prompts

### useImageState Hook
- Centralized state management
- Image upload handling
- Mock AI generation with delays
- History tracking

## Mock API Integration

The app includes placeholder functions that simulate AI processing:

- **Upload Processing**: Immediate image preview
- **Generation Delay**: 2.5 second realistic loading
- **Mock Results**: Returns modified versions for demo

## Styling

The app uses a carefully crafted design system with:

- **Color Palette**: Warm neutrals and sage greens
- **Typography**: Inter font family
- **Spacing**: Consistent rem-based spacing
- **Animations**: Smooth transitions and hover effects

## Accessibility Features

- Proper ARIA labels
- Keyboard navigation support
- Alt text for images
- Focus management
- Screen reader friendly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Future Enhancements

- Real AI integration (Gemini API)
- User authentication
- Save/share designs
- Advanced editing tools
- Mobile app version

## License

Built for the AI Interior Design Hackathon 2024

---

**Demo Ready**: This application is fully functional for demonstration purposes with realistic mock data and smooth user experience.