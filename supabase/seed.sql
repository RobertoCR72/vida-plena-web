-- Dados ficticios para demonstracao academica. Crie usuarios Auth equivalentes ou ajuste os UUIDs apos o cadastro.
insert into public.profiles (id, full_name, email, phone_whatsapp, city, state, role, status) values
('00000000-0000-0000-0000-000000000001','Admin Demo','admin.demo@vidaplena.org',null,'Sao Paulo','SP','admin','active'),
('00000000-0000-0000-0000-000000000002','Gestor Demo','gestor.demo@vidaplena.org',null,'Sao Paulo','SP','lecture_manager','active'),
('00000000-0000-0000-0000-000000000011','Marina Costa','marina.demo@example.com','5511990000011','Campinas','SP','speaker','approved'),
('00000000-0000-0000-0000-000000000012','Rafael Lima','rafael.demo@example.com','5521990000012','Rio de Janeiro','RJ','speaker','approved'),
('00000000-0000-0000-0000-000000000013','Camila Rocha','camila.demo@example.com','5531990000013','Belo Horizonte','MG','speaker','pending'),
('00000000-0000-0000-0000-000000000021','Ana Souza','ana.demo@example.com','5511990000021','Sao Paulo','SP','participant','active'),
('00000000-0000-0000-0000-000000000022','Bruno Alves','bruno.demo@example.com','5521990000022','Niteroi','RJ','participant','active'),
('00000000-0000-0000-0000-000000000023','Carla Mendes','carla.demo@example.com','5531990000023','Betim','MG','participant','active'),
('00000000-0000-0000-0000-000000000024','Diego Ramos','diego.demo@example.com','5541990000024','Curitiba','PR','participant','active'),
('00000000-0000-0000-0000-000000000025','Elisa Nunes','elisa.demo@example.com','5585990000025','Fortaleza','CE','participant','active'),
('00000000-0000-0000-0000-000000000026','Fabio Torres','fabio.demo@example.com','5591990000026','Belem','PA','participant','active'),
('00000000-0000-0000-0000-000000000027','Gisele Prado','gisele.demo@example.com','5561990000027','Brasilia','DF','participant','active'),
('00000000-0000-0000-0000-000000000028','Henrique Dias','henrique.demo@example.com','5548990000028','Florianopolis','SC','participant','active')
on conflict (id) do nothing;

insert into public.speakers (id, profile_id, bio, organization, expertise_area, approval_status, approved_by, approved_at) values
('10000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000011','Educadora social e mentora de tecnologia.','Instituto Ponte','Inclusao digital','approved','00000000-0000-0000-0000-000000000001',now()),
('10000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000012','Especialista em empregabilidade jovem.','RH Solidario','Carreira','approved','00000000-0000-0000-0000-000000000001',now()),
('10000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000013','Agente comunitaria de saude.','Rede Comunidade Viva','Saude preventiva','pending',null,null)
on conflict (id) do nothing;

insert into public.lectures (id, title, theme, description, content_summary, category, date, start_time, end_time, duration_minutes, room, location, capacity, status, created_by) values
('20000000-0000-0000-0000-000000000001','Inclusao Digital para Jovens','Tecnologia cidadania','Uso seguro de ferramentas digitais.','E-mail, documentos online e servicos publicos digitais.','Tecnologia','2026-07-12','09:00','10:30',90,'Sala 1','Sede Vida Plena',40,'published','00000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000002','Como Preparar um Curriculo Profissional','Empregabilidade','Oficina pratica de curriculo.','Estrutura, experiencias e revisao.','Carreira','2026-07-12','10:00','11:30',90,'Sala 2','Sede Vida Plena',35,'published','00000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000003','Introducao ao Mercado de Trabalho','Primeiro emprego','Orientacao para entrada no mercado.','Entrevista, postura e direitos basicos.','Carreira','2026-07-13','14:00','15:30',90,'Auditorio','Centro Comunitario',80,'published','00000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000004','Saude Preventiva na Comunidade','Bem-estar','Cuidados preventivos e acesso a rede local.','Vacinas, acompanhamento e prevencao.','Saude','2026-07-13','15:00','16:00',60,'Sala 3','Centro Comunitario',45,'published','00000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000005','Educacao Financeira Basica','Financas pessoais','Organizacao financeira familiar.','Orcamento, reserva e consumo consciente.','Financas','2026-07-14','09:30','11:00',90,'Sala 1','Sede Vida Plena',50,'published','00000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000006','Empreendedorismo Social','Impacto local','Criacao de iniciativas comunitarias.','Modelo social, parcerias e indicadores.','Impacto social','2026-07-14','14:00','16:00',120,'Auditorio','Sede Vida Plena',70,'draft','00000000-0000-0000-0000-000000000002')
on conflict (id) do nothing;

insert into public.lecture_speakers (lecture_id, speaker_id, role_in_lecture) values
('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000011','main'),
('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000012','main'),
('20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000012','main'),
('20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000011','co_speaker'),
('20000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000013','main'),
('20000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000011','main')
on conflict (lecture_id, speaker_id) do nothing;

insert into public.enrollments (id, participant_id, lecture_id, status, confirmed_by, confirmed_at) values
('30000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000021','20000000-0000-0000-0000-000000000001','confirmed','00000000-0000-0000-0000-000000000001',now()),
('30000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000022','20000000-0000-0000-0000-000000000001','pending',null,null),
('30000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000023','20000000-0000-0000-0000-000000000002','waitlisted',null,null),
('30000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000024','20000000-0000-0000-0000-000000000002','confirmed','00000000-0000-0000-0000-000000000001',now()),
('30000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000025','20000000-0000-0000-0000-000000000003','confirmed','00000000-0000-0000-0000-000000000001',now()),
('30000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000026','20000000-0000-0000-0000-000000000003','rejected',null,null),
('30000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000027','20000000-0000-0000-0000-000000000004','pending',null,null),
('30000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000028','20000000-0000-0000-0000-000000000005','confirmed','00000000-0000-0000-0000-000000000001',now())
on conflict (id) do nothing;

insert into public.attendance (enrollment_id, checked_in, checked_in_at, checked_in_by) values
('30000000-0000-0000-0000-000000000001',true,now(),'00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000004',true,now(),'00000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000005',false,null,null),
('30000000-0000-0000-0000-000000000008',true,now(),'00000000-0000-0000-0000-000000000001')
on conflict (enrollment_id) do nothing;

insert into public.lecture_feedback (enrollment_id, rating, comment) values
('30000000-0000-0000-0000-000000000001',5,'Conteudo claro e aplicavel.'),
('30000000-0000-0000-0000-000000000004',4,'A oficina ajudou na revisao do curriculo.'),
('30000000-0000-0000-0000-000000000008',5,'Material financeiro muito util.')
on conflict (enrollment_id) do nothing;

insert into public.notifications (user_id, lecture_id, channel, type, destination, subject, message, status, provider_response) values
('00000000-0000-0000-0000-000000000021','20000000-0000-0000-0000-000000000001','email','enrollment_confirmed','ana.demo@example.com','Inscricao confirmada - Inclusao Digital para Jovens','Sua inscricao foi confirmada.','simulated','{"mode":"simulated"}'),
('00000000-0000-0000-0000-000000000021','20000000-0000-0000-0000-000000000001','whatsapp','enrollment_confirmed','5511990000021','Link WhatsApp gerado','https://wa.me/5511990000021?text=Inscricao%20confirmada','simulated','{"mode":"simulated"}'),
('00000000-0000-0000-0000-000000000011',null,'system','speaker_approved',null,'Palestrante aprovado','Seu acesso de palestrante foi aprovado.','simulated','{"mode":"simulated"}');

insert into public.audit_logs (user_id, action, entity_type, entity_id, metadata) values
('00000000-0000-0000-0000-000000000001','confirm_enrollment','enrollments','30000000-0000-0000-0000-000000000001','{"status":"confirmed"}'),
('00000000-0000-0000-0000-000000000001','approve_speaker','speakers','10000000-0000-0000-0000-000000000011','{"approval_status":"approved"}'),
('00000000-0000-0000-0000-000000000002','publish_lecture','lectures','20000000-0000-0000-0000-000000000001','{"status":"published"}');
