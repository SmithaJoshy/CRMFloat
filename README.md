# CRMFloat 💧

**Where Customer Relationships Flow Seamlessly**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/crmfloat)
[![License](https://img.shields.io/badge/license-Commercial-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D6.0-green.svg)](https://www.mongodb.com)

---

## 🌊 What is CRMFloat?

CRMFloat is a modern, intuitive Customer Relationship Management system that makes managing clients, projects, and teams effortless. Built for businesses that value simplicity without sacrificing power.

### ✨ Why CRMFloat?

- **💧 Flow Naturally** - Intuitive interface that feels natural from day one
- **📊 Visual Pipeline** - See your deals flowing through your sales process
- **🎯 All-in-One** - CRM + Projects + Invoicing + Team Management
- **🚀 Lightning Fast** - Built on modern technology for instant response
- **🔐 Bank-Level Security** - Your data protected with enterprise-grade encryption
- **📱 Anywhere Access** - Cloud-based, mobile-ready interface

---

## 🎯 Perfect For

- 🏢 **Small to Medium Businesses** - Start professional, scale seamlessly
- 🎨 **Design Agencies** - Built with creative businesses in mind
- 💼 **Consulting Firms** - Manage clients and projects effortlessly
- 🏗️ **Professional Services** - Track everything in one place
- 🤝 **Any Business with Clients** - If you have customers, you need CRMFloat

---

## ⚡ Key Features

### 📋 Client Management
- Complete client profiles with contact history
- Document management and file uploads
- Communication logs and notes
- Custom fields and tags

### 🔄 Visual Pipeline
- Drag-and-drop deal tracking
- Customizable stages
- Real-time progress updates
- Pipeline analytics

### 📊 Kanban Boards
- Visual project management
- Drag-and-drop task organization
- Team collaboration
- Progress tracking

### 💎 Beyond Care
- Customer loyalty tracking
- Testimonial management
- Project showcase
- Rewards and referrals
- Anniversary tracking

### 👥 Team Management
- Designer/team member profiles
- Availability tracking
- Workload management
- Communication tools

### 💰 Invoicing & Payments
- Built-in invoice creation
- Payment tracking
- Client payment history
- Payment reminders

### 📁 Document Management
- Centralized file storage
- Client/project organization
- Version control
- Secure sharing

### 📈 Analytics & Reporting
- Real-time dashboards
- Performance metrics
- Revenue tracking
- Custom reports

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- MongoDB 6.0+
- 2GB+ RAM
- 10GB+ disk space

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/crmfloat.git
cd crmfloat

# Install dependencies
npm install

# Configure environment
cp config.env.example .env
# Edit .env with your settings

# Build frontend
npm run build

# Seed database (optional)
npm run seed

# Start server
npm start
```

### Docker Deployment

```bash
# Using Docker Compose
cd deployment/docker
docker-compose up -d
```

### Access CRMFloat

Open your browser and navigate to:
- **Application:** http://localhost:8081
- **Health Check:** http://localhost:8081/api/health

**Demo Credentials:**
- Email: `admin@crmfloat.com`
- Password: `admin123`

---

## 📚 Documentation

Comprehensive documentation is available in the `/documentation` folder:

- **[User Guide](documentation/user-guides/USER_GUIDE.md)** - Complete user manual
- **[API Reference](documentation/api/API_REFERENCE.md)** - REST API documentation
- **[Deployment Guide](documentation/deployment/PRODUCTION_DEPLOYMENT.md)** - Production setup
- **[Documentation Index](documentation/INDEX.md)** - Complete documentation list

---

## 🎨 Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Material-UI** - Beautiful, responsive components
- **TypeScript** - Type-safe development
- **Dnd-kit** - Smooth drag-and-drop

### Backend
- **Node.js** - Fast, scalable runtime
- **Express.js** - Robust API framework
- **MongoDB** - Flexible, scalable database
- **JWT** - Secure authentication

### Infrastructure
- **Docker** - Containerized deployment
- **Kubernetes** - Orchestrated scaling
- **Nginx** - Reverse proxy and load balancing

---

## 💼 Pricing

### 🆓 Free Tier
**Perfect for trying CRMFloat**
- Up to 3 users
- 50 clients
- 25 projects
- Basic features
- Community support

### 💼 Professional - $29/user/month
**For growing businesses**
- Unlimited users
- Unlimited clients & projects
- All features unlocked
- Priority email support
- API access
- Custom reports

### 🏢 Enterprise - Custom Pricing
**For large organizations**
- Everything in Professional
- White-label option
- Custom integrations
- Dedicated account manager
- SLA guarantee
- On-premise deployment
- 24/7 phone support

---

## 🌟 What Makes CRMFloat Different?

### 🎯 Built for Simplicity
No complex setup, no training required. Start managing clients in minutes.

### 🔄 Visual Workflow
See your entire business flow at a glance with intuitive pipelines and boards.

### 💎 Beyond Just CRM
Not just contacts - manage projects, invoices, teams, and customer loyalty all in one place.

### 🚀 Modern Technology
Built with the latest tech stack for speed, security, and scalability.

### 💰 Transparent Pricing
No hidden fees, no surprises. Pay for what you use, cancel anytime.

### 🤝 Customer-First
We listen to our users and continuously improve based on your feedback.

---

## 🛠️ Development

### Local Development

```bash
# Start development server
npm run dev

# Start mock server (testing)
npm run dev:mock

# Run tests
npm test

# Build for production
npm run build
```

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm run dev:mock` - Start mock server
- `npm run build` - Build production frontend
- `npm run seed` - Seed database with sample data
- `npm test` - Run all tests
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Start with Docker Compose

---

## 🤝 Support

### Getting Help

- 📖 **Documentation** - Check our comprehensive guides
- 💬 **Community Forum** - Ask questions and share tips
- 📧 **Email Support** - support@crmfloat.com
- 🎥 **Video Tutorials** - Step-by-step walkthroughs

### Report Issues

Found a bug or have a feature request?
- Open an issue on GitHub
- Email us at support@crmfloat.com
- Chat with us in-app

---

## 🔐 Security

CRMFloat takes security seriously:

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - Bcrypt encryption
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **HTTPS/SSL** - Encrypted data transmission
- ✅ **Data Validation** - Input sanitization
- ✅ **Regular Updates** - Security patches and updates

---

## 📈 Roadmap

### Coming Soon
- [ ] Mobile apps (iOS & Android)
- [ ] Email integration (Gmail, Outlook)
- [ ] Calendar synchronization
- [ ] Advanced analytics and AI insights
- [ ] Custom workflow automation
- [ ] Multi-language support
- [ ] WhatsApp integration
- [ ] Voice notes and transcription

### Under Consideration
- Third-party integrations (Zapier, etc.)
- Advanced reporting and forecasting
- Custom fields and modules
- White-label partners program

---

## 📜 License

CRMFloat is commercial software. See [LICENSE](LICENSE) for details.

**Trial Version:** Free 14-day trial, no credit card required  
**Production Use:** Requires a valid license

For licensing inquiries: sales@crmfloat.com

---

## 🌐 Links

- **Website:** https://crmfloat.com
- **Documentation:** https://docs.crmfloat.com
- **GitHub:** https://github.com/yourusername/crmfloat
- **Support:** support@crmfloat.com
- **Sales:** sales@crmfloat.com

---

## 🙏 Acknowledgments

Built with ❤️ by the CRMFloat team.

Special thanks to:
- Our early adopters and beta testers
- The open-source community
- Everyone who provided feedback

---

## 📞 Contact

**CRMFloat Team**

- 🌐 Website: https://crmfloat.com
- 📧 Email: info@crmfloat.com
- 💼 LinkedIn: https://linkedin.com/company/crmfloat
- 🐦 Twitter: @CRMFloat
- 📷 Instagram: @CRMFloat

---

<div align="center">

**CRMFloat** - Where Customer Relationships Flow Seamlessly 💧

[Get Started](https://crmfloat.com) · [View Demo](https://demo.crmfloat.com) · [Documentation](documentation/INDEX.md)

---

Made with 💙 by CRMFloat Team | © 2024 CRMFloat. All rights reserved.

</div>