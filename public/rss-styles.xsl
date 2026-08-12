<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
	<xsl:template match="/">
		<html lang="es">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title><xsl:value-of select="rss/channel/title" /> — feed RSS</title>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="crossorigin" />
				<link
					href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,900;1,9..144,400&amp;family=Space+Mono:wght@400;700&amp;display=swap"
					rel="stylesheet"
				/>
				<style>
					:root {
						--paper: #f2e4cc;
						--paper-2: #ebdcc2;
						--ink: #1b1916;
						--pink: #e5468a;
						--muted: #8c7f6e;
						--line: #cfc4ae;
					}
					* { box-sizing: border-box; }
					body {
						margin: 0;
						background: var(--paper);
						color: var(--ink);
						font-family: 'Space Mono', ui-monospace, monospace;
						line-height: 1.6;
						-webkit-font-smoothing: antialiased;
					}
					.wrap { max-width: 720px; margin: 0 auto; padding: 2.5rem 1.3rem 4rem; }
					.kicker {
						font-size: 0.72rem; letter-spacing: 0.28em; text-transform: uppercase;
						color: var(--pink); margin: 0 0 0.5rem;
					}
					h1 {
						font-family: 'Fraunces', Georgia, serif; font-weight: 900;
						font-size: clamp(2.2rem, 7vw, 3.4rem); line-height: 1; margin: 0 0 0.6rem;
						text-transform: lowercase;
					}
					.lead { font-size: 0.95rem; color: #42392c; margin: 0 0 0.4rem; }
					.note {
						border: 2px solid var(--ink); background: var(--paper-2);
						padding: 1rem 1.1rem; margin: 1.6rem 0 2rem; font-size: 0.85rem;
					}
					.note b { color: var(--ink); }
					.rule { height: 2px; background: var(--ink); border: 0; margin: 0 0 1.5rem; }
					.item {
						padding: 1.1rem 0; border-top: 1px solid var(--line);
						text-decoration: none; color: var(--ink); display: block;
					}
					.item:hover { background: var(--paper-2); }
					.item:hover .item-title { color: var(--pink); }
					.item-title {
						font-family: 'Fraunces', Georgia, serif; font-weight: 900;
						font-size: 1.3rem; line-height: 1.15; margin: 0 0 0.25rem; display: block;
					}
					.item-meta { font-size: 0.75rem; color: var(--muted); }
					.foot {
						margin-top: 2.5rem; font-size: 0.75rem; color: var(--muted);
						text-transform: uppercase; letter-spacing: 0.08em;
					}
					.foot a { color: var(--pink); }
				</style>
			</head>
			<body>
				<div class="wrap">
					<p class="kicker">// feed rss</p>
					<h1><xsl:value-of select="rss/channel/title" /></h1>
					<p class="lead"><xsl:value-of select="rss/channel/description" /></p>

					<div class="note">
						Esto es el <b>feed RSS</b> de la revista: la lista de publicaciones para seguirla
						desde una <b>app lectora de feeds</b> (Feedly, Inoreader, NetNewsWire, etc.).
						Copia la dirección de esta página y pégala en tu lector para recibir cada texto
						nuevo automáticamente, sin depender de correo ni redes.
					</div>

					<hr class="rule" />

					<xsl:for-each select="rss/channel/item">
						<a class="item" href="{link}">
							<span class="item-title"><xsl:value-of select="title" /></span>
							<span class="item-meta">
								<xsl:value-of select="substring(pubDate, 1, 16)" />
								<xsl:if test="description"> · <xsl:value-of select="description" /></xsl:if>
							</span>
						</a>
					</xsl:for-each>

					<p class="foot">
						← <a href="{rss/channel/link}">volver a la revista</a>
					</p>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
