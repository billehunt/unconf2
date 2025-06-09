## Purpose & Vision

Create a **zero-install, QR-first web tool** that allows an unconference to be launched in minutes. Attendees join by scanning a QR code, collaboratively define the agenda through AI-assisted topic generation and voting, and receive a conflict-free schedule plus consolidated notes and summaries—without installing an app or dealing with offline modes.

---

## Functional Requirements

| ID        | Requirement                      | Detail                                                                                                                          |
| --------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **FR-1**  | **Instant Event Setup**          | Organiser wizard (event info → rooms → time blocks) completes in ≤ 10 min.                                                      |
| **FR-2**  | **QR-Based Onboarding**          | Unique QR opens attendee web app; no login required unless organiser opts for name/email capture.                               |
| **FR-3**  | **Interest & Topic Capture**     | Attendees can enter free-text interests and propose session topics; entries accepted until evaluation ends.                     |
| **FR-4**  | **AI Topic Suggestions**         | During evaluation, an LLM clusters interests and proposes up to *5 new topics per minute* (interval configurable).              |
| **FR-5**  | **Voting Board (Up-votes Only)** | Attendees up-vote topics in real time; no down-votes.                                                                           |
| **FR-6**  | **Moderator Controls**           | Organiser can delete topics (e.g., duplicates) at any time before lock-down; cannot add down-votes.                             |
| **FR-7**  | **Evaluation Timer**             | Default 10-minute countdown (configurable). At expiry or organiser override, voting freezes and top-ranked topics are “locked.” |
| **FR-8**  | **Automated Scheduling**         | Locked topics auto-assigned to fixed rooms/time slots with zero speaker/room conflicts.                                         |
| **FR-9**  | **Live Updates**                 | All schedule or topic changes pushed to devices in < 5 s via WebSockets.                                                        |
| **FR-10** | **Session Workspaces**           | Each session page offers collaborative Markdown notes and 1–5-star ratings.                                                     |
| **FR-11** | **Daily Recap**                  | At day end, system compiles notes, ratings, and key stats into a shareable PDF + link.                                          |
| **FR-12** | **Web-only Operation**           | No offline capability; assumes continuous network connectivity.                                                                 |

---

## Personas

| Persona                          | Goals                                                                                      | Frustrations Addressed                            |
| -------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| **Olivia – Organiser**           | Launch agenda fast, avoid topic chaos, keep schedule conflict-free, get post-event insight | Manual topic sorting, last-minute speaker clashes |
| **Ravi – Attendee/Speaker**      | Join instantly, propose & vote topics, stay informed of changes, record session notes      | App installs, paper schedules, missing updates    |
| **Carmen – Sponsor/Stakeholder** | Measure engagement, ensure branding presence, receive concise event summary                | Low visibility into attendee interaction          |

---

## Key User Flows

1. **Event Creation (Olivia)**

   1. Opens organiser portal → completes 3-step wizard.
   2. Event QR displayed for distribution.

2. **Join & Ideation (Ravi)**

   1. Scans QR → enters name (optional) + interests/topics.
   2. Topic Voting Board opens; Ravi up-votes others’ ideas while AI adds new suggestions every minute.

3. **Moderator Actions (Olivia)**

   1. Watches live board → deletes duplicate topics as needed.
   2. At timer 0 (or earlier), clicks **Lock Topics**.

4. **Scheduling & Notification**

   1. System assigns sessions to rooms/time slots.
   2. Schedule grid instantly pushed to all attendees.

5. **Session Participation**

   1. Ravi opens a session page, adds notes and a rating.
   2. Live edits visible to everyone in the session workspace.

6. **Daily Wrap-Up**

   1. After final slot, platform generates PDF recap with schedule, notes, and vote stats.
   2. Link sent to Olivia (and optionally to all attendees).
