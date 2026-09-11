import type { OfficeTask } from './daily-engine';

export type PixelAgentState = {
  employeeId: string;
  status: 'idle'|'queued'|'researching'|'working'|'collaborating'|'waiting_external'|'approval_required'|'blocked'|'completed'|'field_operation';
  room: string;
  station: string;
  bubble?: string;
  taskId?: string;
  caseId?: string;
};

const ROOM_BY_TEAM: Record<string,string> = {
  'inquiry.inbox': 'inquiry-room',
  'client.consult': 'consult-room',
  'proposal.quote': 'proposal-room',
  'mail.brief.qa': 'qa-room',
  'contract.desk': 'contract-room',
  'show.operations': 'operations-room',
  'blog.seo': 'seo-room',
  'sales.outbound': 'sales-room',
  'settlement.xls': 'settlement-room',
  'pipeline.review': 'pipeline-room',
  'social.marketing': 'social-room',
  'secretary.hq': 'secretary-room',
};

export function taskToPixelState(task: OfficeTask): PixelAgentState {
  let status: PixelAgentState['status'] = 'working';
  let room = ROOM_BY_TEAM[task.team] || 'lounge';
  let station = 'desk';
  let bubble = task.title;

  if (task.status === 'queued') status = 'queued';
  if (/조사|발굴|검색|리드|근거/.test(task.title + task.instructions)) {
    status = 'researching'; station = 'research-desk';
  }
  if (task.status === 'waiting_external') {
    status = 'waiting_external'; room = 'waiting-zone'; station = 'mailbox'; bubble = '외부 회신 대기';
  }
  if (task.status === 'approval_required' || task.approvalRequired) {
    status = 'approval_required'; room = 'approval-room'; station = 'approval-door'; bubble = '대표 승인 대기';
  }
  if (task.status === 'blocked') {
    status = 'blocked'; station = 'blocked-marker'; bubble = '확인 필요';
  }
  if (task.status === 'completed') {
    status = 'completed'; station = 'handoff-desk'; bubble = '완료 · 인계 중';
  }
  if (/현장|공연 당일|콜타임/.test(task.title + task.instructions)) {
    status = 'field_operation'; room = 'entrance'; station = 'field-exit'; bubble = '현장 운영';
  }

  return { employeeId: task.employeeId, status, room, station, bubble, taskId: task.id, caseId: task.caseId };
}

export function officeSimulationSnapshot(allEmployeeIds: string[], tasks: OfficeTask[]): PixelAgentState[] {
  const activeByEmployee = new Map<string, OfficeTask>();
  const rank = { working: 6, approval_required: 5, blocked: 5, waiting_external: 4, queued: 3, completed: 1 } as Record<string,number>;

  for (const t of tasks) {
    if (!['queued','working','waiting_external','approval_required','blocked','completed'].includes(t.status)) continue;
    const prev = activeByEmployee.get(t.employeeId);
    if (!prev || (rank[t.status] || 0) > (rank[prev.status] || 0)) activeByEmployee.set(t.employeeId, t);
  }

  return allEmployeeIds.map(employeeId => {
    const t = activeByEmployee.get(employeeId);
    if (!t) return { employeeId, status: 'idle', room: 'home-team-room', station: 'own-desk', bubble: '대기' };
    return taskToPixelState(t);
  });
}
