
<div align="center">

<h1>🐾 ClinicVetPro</h1>

<p>
  <b>Plataforma SaaS multi-clínicas para gestão veterinária</b><br/>
  Arquitetura <b>multi-tenant</b>, controle de acesso por papéis (<b>RBAC</b>) e convites por link.
</p>

<p>
  <img alt="React" src="https://img.shields.io/badge/React-0B1220?logo=react&logoColor=61DAFB" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-0B1220?logo=vite&logoColor=F7DF1E" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-0B1220?logo=tailwindcss&logoColor=38BDF8" />
  <img alt="Express" src="https://img.shields.io/badge/Express-0B1220?logo=express&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-0B1220?logo=prisma&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL%20(Supabase)-0B1220?logo=postgresql&logoColor=white" />
</p>

<hr style="width: 100%; max-width: 980px; opacity: .25;" />

</div>

<div style="max-width: 980px; margin: 0 auto;">

<h2>📌 Visão Geral</h2>

<ul>
  <li>Arquitetura <b>multi-tenant</b> com isolamento por clínica.</li>
  <li>Cadastro inicial exclusivo do <b>Dono</b>.</li>
  <li>Entrada de membros via <b>convite por link</b> (papel definido no convite).</li>
  <li>Papéis com permissões distintas: <b>Dono</b>, <b>Administrativo</b>, <b>Médico</b>, <b>Recepção</b>.</li>
  <li>Estrutura preparada para expansão de módulos.</li>
</ul>

<h2>✅ Funcionalidades Iniciais</h2>

<table>
  <thead>
    <tr>
      <th align="left">Módulo</th>
      <th align="left">Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>🔐 RBAC</b></td>
      <td>Permissões por papel com proteção de rotas e ações no backend e frontend.</td>
    </tr>
    <tr>
      <td><b>🔗 Convites</b></td>
      <td>Convite por link com papel definido, validade e vínculo automático à clínica.</td>
    </tr>
    <tr>
      <td><b>🗓️ Agenda</b></td>
      <td>Agendamentos por clínica com status e organização por período.</td>
    </tr>
    <tr>
      <td><b>👤 Tutores & 🐶 Pets</b></td>
      <td>Cadastro estruturado de tutores e associação de múltiplos pets.</td>
    </tr>
  </tbody>
</table>

<h2>🧱 Stack</h2>

<ul>
  <li><b>Frontend:</b> React + Vite + TailwindCSS</li>
  <li><b>Backend:</b> Express + Prisma (API REST)</li>
  <li><b>Banco:</b> PostgreSQL (Supabase)</li>
</ul>

<p>
  Arquitetura baseada em API REST, com modelagem e migrações gerenciadas via Prisma.
</p>

<h2>🏗️ Estrutura do Monorepo</h2>

<pre><code>ClinicVetPro/
├─ apps/
│  ├─ web/        # React + Vite + Tailwind
│  └─ api/        # Express + Prisma
├─ packages/
│  └─ shared/     # Tipos e regras compartilhadas (opcional)
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/
└─ docs/
</code></pre>

<h2>🚀 Como Rodar</h2>

<ol>
  <li><b>Configurar variáveis de ambiente</b> (Front e Back): crie os arquivos <code>.env</code> em <code>apps/web</code> e <code>apps/api</code>.</li>
  <li><b>Instalar dependências</b>:</li>
</ol>

<pre><code>pnpm install</code></pre>

<ol start="3">
  <li><b>Rodar migrações</b>:</li>
</ol>

<pre><code>pnpm db:migrate</code></pre>

<ol start="4">
  <li><b>Subir ambiente de desenvolvimento</b>:</li>
</ol>

<pre><code>pnpm dev</code></pre>

<h2>🧭 Roadmap</h2>

<h3>Sprint 1 — Estrutura Base</h3>
<ul>
  <li>Estrutura do monorepo e padronização (web / api / prisma).</li>
  <li>Modelo multi-tenant (clinic_id em entidades do domínio).</li>
  <li>RBAC inicial (papéis e proteção de rotas/módulos).</li>
  <li>Convites por link (gerar → cadastrar → vincular ao papel).</li>
  <li>CRUD essencial: Tutor e Pet (Tutor → Pets).</li>
  <li>Agenda básica: criar e listar agendamentos por clínica.</li>
</ul>

<h3>Sprint 2</h3>
<ul>
  <li>Refino da agenda (status, filtros, visualização).</li>
  <li>Dashboard com métricas operacionais.</li>
  <li>Melhorias de UX, validações e consistência de estados.</li>
</ul>

<h3>Sprint 3</h3>
<ul>
  <li>Estoque e Serviços.</li>
  <li>Relatórios operacionais.</li>
  <li>Auditoria e logs.</li>
</ul>

<h2>📷 Screenshots</h2>

<p>
  Salve imagens em <code>docs/screens</code> e referencie no README:
</p>

<pre><code>![Dashboard](docs/screens/dashboard.png)
![Agenda](docs/screens/agenda.png)</code></pre>

</div>
<!-- README.md (HTML compatível com GitHub) — ClinicVetPro -->
<div align="center">

<h1>🐾 ClinicVetPro</h1>

<p>
  <b>Plataforma SaaS multi-clínicas para gestão veterinária</b><br/>
  Arquitetura <b>multi-tenant</b>, controle de acesso por papéis (<b>RBAC</b>) e convites por link.
</p>

<p>
  <img alt="React" src="https://img.shields.io/badge/React-0B1220?logo=react&logoColor=61DAFB" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-0B1220?logo=vite&logoColor=F7DF1E" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-0B1220?logo=tailwindcss&logoColor=38BDF8" />
  <img alt="Express" src="https://img.shields.io/badge/Express-0B1220?logo=express&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-0B1220?logo=prisma&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL%20(Supabase)-0B1220?logo=postgresql&logoColor=white" />
</p>

<hr style="width: 100%; max-width: 980px; opacity: .25;" />

</div>

<div style="max-width: 980px; margin: 0 auto;">

<h2>📌 Visão Geral</h2>

<ul>
  <li>Arquitetura <b>multi-tenant</b> com isolamento por clínica.</li>
  <li>Cadastro inicial exclusivo do <b>Dono</b>.</li>
  <li>Entrada de membros via <b>convite por link</b> (papel definido no convite).</li>
  <li>Papéis com permissões distintas: <b>Dono</b>, <b>Administrativo</b>, <b>Médico</b>, <b>Recepção</b>.</li>
  <li>Estrutura preparada para expansão de módulos.</li>
</ul>

<h2>✅ Funcionalidades Iniciais</h2>

<table>
  <thead>
    <tr>
      <th align="left">Módulo</th>
      <th align="left">Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>🔐 RBAC</b></td>
      <td>Permissões por papel com proteção de rotas e ações no backend e frontend.</td>
    </tr>
    <tr>
      <td><b>🔗 Convites</b></td>
      <td>Convite por link com papel definido, validade e vínculo automático à clínica.</td>
    </tr>
    <tr>
      <td><b>🗓️ Agenda</b></td>
      <td>Agendamentos por clínica com status e organização por período.</td>
    </tr>
    <tr>
      <td><b>👤 Tutores & 🐶 Pets</b></td>
      <td>Cadastro estruturado de tutores e associação de múltiplos pets.</td>
    </tr>
  </tbody>
</table>

<h2>🧱 Stack</h2>

<ul>
  <li><b>Frontend:</b> React + Vite + TailwindCSS</li>
  <li><b>Backend:</b> Express + Prisma (API REST)</li>
  <li><b>Banco:</b> PostgreSQL (Supabase)</li>
</ul>

<p>
  Arquitetura baseada em API REST, com modelagem e migrações gerenciadas via Prisma.
</p>

<h2>🏗️ Estrutura do Monorepo</h2>

<pre><code>ClinicVetPro/
├─ apps/
│  ├─ web/        # React + Vite + Tailwind
│  └─ api/        # Express + Prisma
├─ packages/
│  └─ shared/     # Tipos e regras compartilhadas (opcional)
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/
└─ docs/
</code></pre>

<h2>🚀 Como Rodar</h2>

<ol>
  <li><b>Configurar variáveis de ambiente</b> (Front e Back): crie os arquivos <code>.env</code> em <code>apps/web</code> e <code>apps/api</code>.</li>
  <li><b>Instalar dependências</b>:</li>
</ol>

<pre><code>pnpm install</code></pre>

<ol start="3">
  <li><b>Rodar migrações</b>:</li>
</ol>

<pre><code>pnpm db:migrate</code></pre>

<ol start="4">
  <li><b>Subir ambiente de desenvolvimento</b>:</li>
</ol>

<pre><code>pnpm dev</code></pre>

<h2>🧭 Roadmap</h2>

<h3>Sprint 1 — Estrutura Base</h3>
<ul>
  <li>Estrutura do monorepo e padronização (web / api / prisma).</li>
  <li>Modelo multi-tenant (clinic_id em entidades do domínio).</li>
  <li>RBAC inicial (papéis e proteção de rotas/módulos).</li>
  <li>Convites por link (gerar → cadastrar → vincular ao papel).</li>
  <li>CRUD essencial: Tutor e Pet (Tutor → Pets).</li>
  <li>Agenda básica: criar e listar agendamentos por clínica.</li>
</ul>

<h3>Sprint 2</h3>
<ul>
  <li>Refino da agenda (status, filtros, visualização).</li>
  <li>Dashboard com métricas operacionais.</li>
  <li>Melhorias de UX, validações e consistência de estados.</li>
</ul>

<h3>Sprint 3</h3>
<ul>
  <li>Estoque e Serviços.</li>
  <li>Relatórios operacionais.</li>
  <li>Auditoria e logs.</li>
</ul>

<h2>📷 Screenshots</h2>

<p>
  Salve imagens em <code>docs/screens</code> e referencie no README:
</p>

<pre><code>![Dashboard](docs/screens/dashboard.png)
![Agenda](docs/screens/agenda.png)</code></pre>

</div>
