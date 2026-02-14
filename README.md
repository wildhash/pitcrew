# PitCrew 🏎️

PitCrew is a secure, observable MCP "workflow racer" built on Archestra: compose multi-tool runs, execute via the MCP orchestrator, and prove prompt-injection/exfiltration defense with an Attack Lap + full traces.

## Features

### 🏁 Race Dashboard
- **MCP Server Registry**: View all available MCP servers with their tools and status
- **Race Templates**: Select from categorized prompt templates (Analysis, Research, Documentation, Workflow, Data)
- **Real-time Execution**: Run workflows with parameter substitution
- **Full Observability**: Track tool calls, token usage, and execution traces

### ⚠️ Attack Lap
- **Security Testing**: Simulate prompt injections, jailbreak attempts, data exfiltration, and privilege escalation
- **Defense Verification**: See which sensitive tools are blocked
- **Audit Trail**: Complete timestamp and verdict tracking

## Screenshots

### Race Dashboard
![Race Dashboard](https://github.com/user-attachments/assets/7e302680-6d83-4619-bd28-8f6b19704988)

### Race Results with Observability
![Race Results](https://github.com/user-attachments/assets/480bb3eb-4939-4881-9018-34cb57d1b464)

### Attack Lap Security Testing
![Attack Lap](https://github.com/user-attachments/assets/e0633c9c-7efc-4ac0-b94b-12b986627d5d)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Runtime**: React 19
- **Testing**: Jest + React Testing Library
- **UI Components**: Custom lightweight UI kit

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/wildhash/pitcrew.git
cd pitcrew
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
pitcrew/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── servers/        # MCP server registry endpoint
│   │   ├── templates/      # Race template registry endpoint
│   │   ├── race/           # Race execution endpoint
│   │   └── attack-lap/     # Attack lap testing endpoint
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx     # Button with variants
│   │   ├── Card.tsx       # Card layouts
│   │   ├── Badge.tsx      # Status badges
│   │   ├── Spinner.tsx    # Loading spinner
│   │   ├── Alert.tsx      # Alert messages
│   │   ├── FormField.tsx  # Form inputs
│   │   └── AsyncBlock.tsx # Loading/error/empty states
│   ├── MCPServersList.tsx  # Server registry display
│   ├── RaceTemplateSelector.tsx  # Template selection
│   ├── RaceExecutor.tsx    # Race execution interface
│   ├── RaceResults.tsx     # Results with observability
│   └── AttackLap.tsx       # Security testing interface
├── lib/                     # Core libraries
│   └── archestra/          # Archestra integration
│       ├── types.ts        # TypeScript type definitions
│       └── client.ts       # Archestra client (mock + real modes)
└── public/                 # Static assets
```

## Usage

### Running a Race

1. Navigate to the **Race Dashboard** tab
2. Review the available MCP servers
3. Select a **Race Template** from the categories
4. Fill in any required parameters
5. Click **Start Race** to execute
6. View results with complete observability data

### Testing Security (Attack Lap)

1. Navigate to the **Attack Lap** tab
2. Select an injection type (Prompt Injection, Jailbreak, Data Exfiltration, or Privilege Escalation)
3. Click **Load Example** or enter a custom attack payload
4. Click **Launch Attack Lap** to test defenses
5. Review the security verdict and blocked tools

## Configuration

### Environment Modes

PitCrew supports two modes: **mock** (default) and **real** (production).

#### Mock Mode (Default)

The app works out of the box with simulated data—no external dependencies required. Perfect for demos and development.

```bash
# .env (or leave unset)
ARCHESTRA_MODE=mock
```

#### Real Mode (Production)

Connect to a real Archestra deployment for production use:

```bash
# .env
ARCHESTRA_MODE=real
ARCHESTRA_API_URL=http://your-archestra-instance:3000
ARCHESTRA_TIMEOUT_MS=8000  # Optional, defaults to 8000ms
```

**Requirements for real mode:**
- `ARCHESTRA_API_URL` must be set to your Archestra instance
- The Archestra server must expose the following endpoints:
  - `GET /api/servers` - List MCP servers
  - `GET /api/templates` - List race templates
  - `POST /api/race` - Execute race
  - `POST /api/attack-lap` - Execute attack lap

See `.env.example` for a complete configuration template.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Testing

PitCrew includes comprehensive tests using Jest and React Testing Library:

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

**Test coverage includes:**
- Component tests (RaceExecutor, AttackLap)
- API route tests (race, attack-lap endpoints)
- Client tests (mock/real mode switching, timeout handling)

All tests pass and cover core functionality, attack scenarios, and error handling.

## Architecture

PitCrew follows a clean architecture pattern:

- **Presentation Layer**: React components with TypeScript and custom UI kit
- **API Layer**: Next.js API routes for server-side logic
- **Integration Layer**: Archestra client with mode switching (mock/real)
- **Type Safety**: Comprehensive TypeScript types throughout
- **Testing**: Full test coverage with Jest and React Testing Library

### What Archestra Features Does PitCrew Demonstrate?

1. **MCP Server Registry**: Discover and list available MCP servers
2. **Prompt Templates**: Reusable workflow templates with parameter substitution
3. **Orchestration**: Execute multi-tool workflows across MCP servers
4. **Security/Attack Lap**: Test prompt injection defense and tool blocking
5. **Observability**: Full execution traces with token usage and tool call tracking

## Security

- All attack testing is sandboxed and monitored
- Mock implementation prevents actual harmful actions
- Production deployments should implement proper authentication and authorization
- Regular security audits recommended

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Acknowledgments

Built with Archestra MCP Orchestrator for secure, observable multi-tool workflows with prompt injection defense.
