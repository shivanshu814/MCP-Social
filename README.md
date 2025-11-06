# 🚀 AI Tweet Generator with MCP

An intelligent tweet generation system powered by AI and Model Context Protocol (MCP). Automatically fetches the latest crypto news and generates professional, engaging tweets with customizable brand context.

## ✨ Features

- 🤖 **AI-Powered Generation**: Uses OpenAI's GPT models for intelligent tweet creation
- 📰 **Real-time News Fetching**: Integrates with CryptoPanic API via MCP for latest crypto news
- 🎯 **Customizable Branding**: Easy to customize for any brand or project context
- 🌐 **Modern Web UI**: Clean, responsive interface with one-click generation
- 📋 **Copy to Clipboard**: Instant copy functionality for generated tweets
- 🔄 **Auto-refresh**: "Get Today's Post" button for instant news-based tweets
- 🏗️ **MCP Architecture**: Built on Model Context Protocol for extensibility

## 🛠️ Tech Stack

- **Backend**: TypeScript, Node.js, Fastify
- **AI/LLM**: OpenAI API (GPT-4o-mini)
- **MCP**: @modelcontextprotocol/sdk
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **News API**: CryptoPanic API
- **Validation**: Zod

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API Key

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/shivanshu814/MCP-Social.git
cd MCP-Social
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
MODEL=gpt-4o-mini
PORT=8000
```

### 4. Run the development server

```bash
npm run dev
```

### 5. Open in browser

Navigate to `http://localhost:8000`

## 🏗️ Project Structure

```
├── src/
│   ├── index.ts          # Main Fastify server
│   ├── llm.ts            # OpenAI API integration
│   ├── mcp-server.ts     # MCP server for crypto news
│   ├── news.ts           # MCP client & news fetching
│   ├── prompt.ts         # System prompts & examples
│   └── schema.ts         # Zod validation schemas
├── public/
│   └── index.html        # Frontend UI
├── .env                  # Environment variables (not in repo)
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 How It Works

1. **User Input**: User enters news/topic or clicks "Get Today's Post"
2. **News Detection**: System detects if automatic news fetching is needed
3. **MCP Integration**: MCP client calls MCP server to fetch latest crypto news
4. **AI Processing**: News is processed through OpenAI API with custom prompts
5. **Tweet Generation**: Professional tweet is generated with brand context
6. **Display**: Tweet is shown with character count and source link

## 🔧 Available Scripts

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

## 🎨 Customization

### Brand Context

Edit `src/prompt.ts` to customize:
- System prompts
- Brand information
- Response examples
- Tone and style

### News Sources

Modify `src/mcp-server.ts` to add more news sources or change filters:
- `rising` - Trending news
- `hot` - Hot topics
- `bullish` - Bullish news

### UI Styling

Edit `public/index.html` to customize:
- Colors and themes
- Layout
- Branding elements

## 📡 API Endpoints

### POST `/chat`

Generate a tweet based on input

**Request:**
```json
{
  "input": "Latest DeFi trends in 2024"
}
```

**Response:**
```json
{
  "answer": "Generated tweet content...",
  "source": "https://source-url.com"
}
```

### GET `/health`

Health check endpoint

**Response:**
```json
{
  "status": "ok"
}
```

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key | Yes | - |
| `MODEL` | OpenAI model name | No | `gpt-4o-mini` |
| `PORT` | Server port | No | `8000` |
| `TGI_URL` | Text Generation Inference URL (optional) | No | - |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- OpenAI for GPT API
- Model Context Protocol team
- CryptoPanic for crypto news API
- Fastify for the amazing web framework

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ using AI and MCP**
