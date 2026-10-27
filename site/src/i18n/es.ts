import type { Dict } from './ru'

// Spanish translation of the published EN/RU release 2957996.
const es: Dict = {
  "countWords": {
    "value": [
      "valor",
      "valores",
      "valores"
    ],
    "variant": [
      "variante",
      "variantes",
      "variantes"
    ],
    "blastocyst": [
      "blastocisto",
      "blastocistos",
      "blastocistos"
    ],
    "embryo": [
      "embrión",
      "embriones",
      "embriones"
    ],
    "comparison": [
      "comparación",
      "comparaciones",
      "comparaciones"
    ],
    "pathogenic": [
      "blastocisto con una variante patogénica",
      "blastocistos con una variante patogénica",
      "blastocistos con una variante patogénica"
    ]
  },
  "site": {
    "title": "PGT-mt Atlas",
    "tagline": "Base de datos abierta de valores publicados de heteroplasmia embrionaria en el test genético preimplantacional de variantes del ADN mitocondrial (PGT-mt). Cada valor está vinculado a su fuente.",
    "curated": "Creador del Atlas y responsable de la curación de sus datos: Ilya Mazunin",
    "preview": "Versión preliminar. El sitio todavía no está publicado; los datos y los textos están pendientes de revisión por el curador.",
    "skip": "Ir al contenido"
  },
  "nav": {
    "fundamentals": "Fundamentos",
    "home": "Inicio",
    "science": "Datos para especialistas",
    "scienceIndex": "Resumen de las secciones",
    "patients": "Para pacientes",
    "about": "Acerca del Atlas",
    "curator": "Ilya Mazunin",
    "data": "Tabla de valores",
    "landscape": "Entre distintos embriones",
    "concordance": "Dentro de un mismo embrión",
    "offspring": "Embrión, feto y niño",
    "model": "Modelo PGT-mt × PGT-A",
    "cases": "Casos publicados",
    "sources": "Fuentes",
    "methods": "Métodos y limitaciones",
    "contribute": "Aportar datos",
    "language": "Idioma",
    "switchTo": "English",
    "primaryLabel": "Menú principal",
    "scienceLabel": "Secciones para especialistas",
    "sectionSelect": "Sección",
    "chapterSelect": "Capítulo",
    "menu": "Menú",
    "menuClose": "Cerrar",
    "theme": "Tema de color: {{mode}}",
    "themeMode": {
      "system": "sistema",
      "light": "claro",
      "dark": "oscuro"
    }
  },
  "footer": {
    "visits": "Visitas:",
    "visitsHelp": "Número total de visitas al Atlas",
    "visitsUnavailable": "El contador de visitas no está disponible temporalmente",
    "updated": "Datos actualizados el {{date}} · versión del conjunto de datos {{version}}",
    "disclaimer": "PGT-mt Atlas no sustituye la consulta con un especialista en genética clínica. El creador y curador de PGT-mt Atlas no ofrece asesoramiento médico.",
    "contribute": "Para investigadores: aportar datos",
    "linksLabel": "Enlaces del sitio"
  },
  "badge": {
    "observed": "Datos observados",
    "model": "Cálculo del modelo",
    "outsideArticle": "vista ampliada",
    "draft": "Borrador"
  },
  "contact": {
    "address": "Dirección:",
    "copy": "Copiar dirección",
    "copied": "Dirección copiada",
    "copyFailed": "No se pudo copiar; seleccione la dirección y cópiela manualmente",
    "noClient": "Si no se abre una aplicación de correo, copie la dirección y envíe el mensaje desde su servicio de correo habitual."
  },
  "common": {
    "value": "Valor",
    "variant": "Variante del ADNmt",
    "source": "Fuente",
    "stage": "Estadio",
    "material": "Material de la muestra",
    "sample": "Tipo de muestra",
    "derivation": "Obtención del valor",
    "note": "Nota del libro de datos",
    "provenance": "Procedencia del valor",
    "sheetRow": "hoja «{{sheet}}», fila {{row}}",
    "legacyId": "ID anterior",
    "variantClass": "Clasificación de la variante",
    "classBasis": {
      "stated_in_source": "fundamento: {{source}}, {{locator}}; comprobado el {{date}}",
      "implied_in_source": "inferido de {{source}}, {{locator}}; comprobado el {{date}}",
      "not_verified": "según el libro de datos complementarios; no se encontró una declaración explícita en la publicación primaria (comprobado el {{date}})"
    },
    "doi": "DOI",
    "pmid": "PMID",
    "noDoi": "sin DOI",
    "status": "Estado",
    "all": "Todos",
    "showTable": "Tabla de datos",
    "downloadCsv": "Descargar CSV",
    "downloadVisibleCsv": "Descargar filas visibles (CSV)",
    "close": "Cerrar",
    "selected": "Registro seleccionado",
    "clickHint": "Seleccione un punto para ver su fuente y la procedencia del valor.",
    "n": "n",
    "notDetected": "variante no detectada",
    "lod": "límite de detección: {{lod}} %",
    "interval": "solo se publicó un intervalo: {{low}}–{{high}} %",
    "lessThan": "por debajo de {{v}} %",
    "upperBoundUnknown": "No se indica el límite superior; consulte la nota de la fuente",
    "loadingChart": "Cargando gráfico…",
    "main": "Resultado principal",
    "chartScrollHint": "El gráfico es más ancho que la pantalla: desplácese horizontalmente para verlo completo →",
    "scrollHint": "El gráfico es más ancho que la pantalla: desplácese horizontalmente para ver todas las variantes →",
    "noJs": "El gráfico interactivo requiere JavaScript. Los mismos datos se muestran en la tabla inferior.",
    "chartError": "No se pudo cargar el módulo del gráfico interactivo. Compruebe la conexión y recargue la página; los mismos datos se muestran en la tabla inferior.",
    "imageError": "No se cargó la imagen. Recargue la página.",
    "figureInArticle": "Vista de referencia",
    "explore": "Explorar",
    "mode": "Modo",
    "threshold": "Valor de corte",
    "reset": "Restablecer",
    "resetChartView": "Volver a la vista inicial",
    "embryo": "Embrión",
    "child": "Niño",
    "tissue": "Tejido",
    "phase": "Fase",
    "age": "Edad",
    "method": "Método",
    "delta": "Δ (tejido − embrión), p. p.",
    "pp": "p. p.",
    "published": "publicado",
    "in_press": "en prensa",
    "conference_abstract": "resumen de congreso",
    "preprint": "prepublicación"
  },
  "pubStatus": {
    "published": "publicado",
    "in_press": "en prensa",
    "conference_abstract": "resumen de congreso",
    "preprint": "prepublicación"
  },
  "verification": {
    "title": "Comprobación con el material complementario publicado",
    "match": "coincide con el ESM",
    "value_mismatch": "difiere del ESM",
    "fraction_label_mismatch": "la categoría de la muestra difiere del material suplementario (ESM)",
    "not_in_dataset": "no está en el conjunto de datos",
    "missing_in_dataset": "falta en el conjunto de datos",
    "mismatch": "discrepancia",
    "datasetKept": "El valor del conjunto de datos se mantiene hasta su revisión por el curador.",
    "corrected": "corregido según el ESM 2",
    "correctedNote": "Una capa de correcciones documentada resuelve estas discrepancias. El sitio muestra los valores del ESM 2 publicado y conserva los valores originales del libro de datos para permitir su comparación.",
    "correctedTitle": "Corregido según la fuente publicada",
    "sourceValue": "en el libro de datos complementarios"
  },
  "home": {
    "lead": "El Atlas presenta niveles de heteroplasmia publicados y explica cómo interpretar estos valores.",
    "k1": "valores de heteroplasmia embrionaria",
    "k2": "{{word}} en los que una muestra de biopsia se comparó con otras partes del mismo embrión (incluida la masa celular interna en {{icm}})",
    "k3": "{{word}} entre muestras embrionarias y muestras de tejidos de {{children}} fetos y niños; en ambas muestras de {{ndChildren}} fetos y niños la variante no fue detectada",
    "sciTitle": "Para especialistas",
    "sciText": "Gráficos interactivos, una tabla de datos con enlaces a las fuentes y una explicación de los métodos y las limitaciones.",
    "patTitle": "Para pacientes",
    "fundTitle": "Fundamentos de PGT-mt",
    "fundText": "Un curso de seis capítulos sobre la herencia del ADNmt y la interpretación de los resultados de PGT-mt, dirigido a profesionales clínicos, embriólogos y estudiantes.",
    "ctaPatients": "Pacientes y familias",
    "ctaSpecialists": "Datos para especialistas",
    "ctaFundamentals": "Fundamentos de PGT-mt: un curso de seis capítulos",
    "patText": "Qué significa la heteroplasmia, qué puede ofrecer PGT-mt y por qué un porcentaje en un informe analítico no es un diagnóstico.",
    "caveat": "El conjunto de datos es descriptivo: no es un metaanálisis, no define un umbral seguro y no sustituye la consulta con un especialista en genética clínica.",
    "kicker": "Una base de datos científica independiente",
    "explore": "Explorar los datos",
    "allSections": "Secciones científicas",
    "figCaption": "Un blastocisto. La primera ampliación muestra una célula del trofoectodermo con su núcleo y pequeñas mitocondrias. La segunda muestra una mitocondria que contiene ADNmt de tipo silvestre y ADNmt con una variante patogénica.",
    "labels": {
      "te": "trofoectodermo",
      "icm": "masa celular\ninterna",
      "cell": "célula del\ntrofoectodermo",
      "wt": "ADNmt de\ntipo silvestre",
      "variant": "variante patogénica\ndel ADNmt"
    },
    "aboutTitle": "La base de datos científica",
    "aboutNote": "su contenido",
    "k4": "{{word}} ({{doi}} con DOI)",
    "landscapeTitle": "Entre distintos embriones",
    "concordanceTitle": "Dentro de un mismo embrión",
    "concordanceSubtitle": "Concordancia de los niveles de heteroplasmia entre distintas partes de un mismo embrión",
    "offspringSubtitle": "Heteroplasmia en biopsias embrionarias y muestras prenatales o posnatales",
    "sectionsTitle": "Secciones del Atlas",
    "sectionsNote": "de la biopsia a los datos",
    "biopsyCaption": "Biopsia del trofoectodermo (TE): una muestra de varias células del TE en la que PGT-mt mide la proporción de ADNmt con una variante patogénica.",
    "dataLink": "Conjunto completo de datos",
    "sourcesLink": "Fuentes",
    "methodsLink": "Métodos y limitaciones",
    "dataTitle": "Solo valores publicados",
    "dataText": "Cada valor del Atlas está vinculado a su fuente primaria. Estas fuentes también sustentan el modelo matemático.",
    "mitoCaption": "Una mitocondria con crestas y moléculas circulares de ADNmt.",
    "curatorBio": "Doctor en Ciencias Biológicas, genetista",
    "biography": "Biografía científica"
  },
  "landscape": {
    "title": "Entre distintos embriones",
    "subtitle": "Niveles de heteroplasmia embrionaria por variante del ADNmt y fuente",
    "lead": "Cada punto representa un valor de heteroplasmia publicado o derivado correspondiente a un embrión. Los marcadores sin relleno indican valores derivados. Los rombos indican embriones 1PN/3PN, que no son candidatos a transferencia. Dentro de cada variante, las columnas separan las fuentes.",
    "yAxis": "Heteroplasmia en la muestra embrionaria, %",
    "share": "Proporción ≤{{t}} %",
    "derivedLegend": "marcador sin relleno: valor calculado por promedio o digitalizado a partir de un gráfico publicado",
    "aggregate": "Agrupar ≥6 valores idénticos (×n)",
    "highlightDerived": "Destacar los valores derivados",
    "stageFilter": "Estadio",
    "customThreshold": "Valor de corte personalizado, %",
    "bands": "Bandas de fondo: hasta el 18 %, verde claro; 18–30 %, azul claro; 30–100 %, rojo claro. El valor de referencia del 18 % se estimó a partir de mediciones en músculo (Hellebrekers et al., 2012); no es un umbral para una muestra de biopsia embrionaria. El programa de Newcastle utilizó principalmente <30 % (Hyslop et al., 2025). Las proporciones incluyen valores ≤ al límite seleccionado. No son umbrales clínicos universales.",
    "groupTitle": "Valores idénticos: {{n}} observaciones",
    "groupHint": "El marcador ×{{n}} agrupa valores idénticos de una misma fuente. Seleccione una observación:",
    "groupInTable": "La tabla inferior muestra solo las observaciones de este grupo.",
    "showAll": "Mostrar todas las observaciones",
    "groupClick": "seleccione para ver todas las observaciones del grupo",
    "main": "La proporción de embriones con heteroplasmia igual o inferior al 18 % varía mucho entre variantes: {{list}}. Estas proporciones describen series publicadas; no estiman la probabilidad para una familia concreta.",
    "intervalNote": "Para dos embriones con m.10197G>A solo se publicaron intervalos. Se muestran como barras; no se imputa un punto medio. Un intervalo se incluye en la proporción ≤ al valor de corte únicamente cuando su límite superior es igual o inferior a dicho valor.",
    "guide18": "Estimación del 18 % (músculo; Hellebrekers 2012)",
    "guide30": "Criterio del 30 % (Newcastle)"
  },
  "concordance": {
    "fractionCounts": "Las amplitudes calculadas a partir de tres muestras (11 embriones) y de dos muestras (29) no son directamente comparables",
    "title": "Dentro de un mismo embrión",
    "subtitle": "Concordancia de los niveles de heteroplasmia entre distintas partes de un mismo embrión",
    "lead": "Los paneles A y B muestran los mismos blastocistos (n = {{n}}). El panel C también incluye {{c}} embriones en segmentación de una misma mujer portadora de m.3243A>G (Monnot et al., 2011; dos blastómeros por embrión).",
    "main": "Los niveles de heteroplasmia suelen ser similares entre muestras de un mismo blastocisto. La mediana de la amplitud intraembrionaria es de {{all}} puntos porcentuales, o {{pat}} puntos porcentuales para las variantes patogénicas (máximo de {{max}} puntos porcentuales). En el {{share}} % de los blastocistos con variantes patogénicas, la amplitud es de 5 puntos porcentuales o menos.",
    "a": "A. Muestras de un mismo embrión",
    "b": "B. Diferencia: muestra analizada − muestra de biopsia clínica",
    "c": "C. Amplitud intraembrionaria (máximo − mínimo)",
    "yA": "Nivel de heteroplasmia, %",
    "yB": "Δ de heteroplasmia, p. p.",
    "yC": "Amplitud, p. p.",
    "pathogenic": "variantes patogénicas",
    "hv2": "HV2: embriones de control",
    "showHv2": "Mostrar HV2",
    "band5": "banda gris: ±5 puntos porcentuales; referencia ilustrativa sin una fuente publicada",
    "median": "mediana",
    "cleavage": "Segmentación, 2 blastómeros",
    "blastPat": "Blastocisto, variante patogénica",
    "blastHv2": "Blastocisto, HV2",
    "remMinusBx": "TE restante − biopsia",
    "icmMinusBx": "ICM − biopsia",
    "combMinusBx": "ICM+TE − biopsia",
    "combShort": "ICM+TE<br>(muestra combinada)",
    "hu": "Datos adicionales: 16 muestras de un blastocisto (Hu et al., 2026)",
    "huText": "Un blastocisto con un 17,8 % de m.3250T>C en la muestra de biopsia se dividió en 16 muestras de 3–5 células; no se aisló la ICM. Estos datos no se representan porque la variabilidad entre muestras celulares pequeñas no es directamente comparable con la variabilidad entre fracciones embrionarias de mayor tamaño.",
    "verifyNote": "Para Tofilo et al., 2026, los valores del embrión 6 (ICM y TE restante) y las categorías de muestra de los embriones 3 y 4 (ICM+TE combinada) siguen el ESM 2 publicado. Los detalles de cada embrión conservan los valores originales del libro de datos. En este estudio, la muestra denominada «ICM» también contiene células del TE adheridas («ICM+»)."
  },
  "offspring": {
    "bothNDPair": "ND → ND",
    "bothNDChildren": "En {{pairs}} comparaciones pareadas de {{children}} fetos y niños, la variante no fue detectada (ND) en ninguna de las dos muestras. Estos resultados no son mediciones exactas de cero.",
    "bothND": "Pares ND → ND: {{n}}",
    "recordSummary": "{{records}} registros, incluidos {{pairs}} pares de muestras de embrión y tejido correspondientes a {{children}} fetos y niños",
    "childSummary": "El nivel de heteroplasmia embrionaria fue bajo en {{low}} de los {{all}} fetos y niños. En {{concordant}} de ellos, todos los resultados tisulares fueron bajos o la variante no fue detectada. Los resultados de distintos laboratorios discrepan en un niño (C5).",
    "deltaBound": "Δ se expresa en puntos porcentuales. Cuando solo el resultado tisular es ND, Δ tiene un límite inferior, representado por un marcador sin relleno y una flecha hacia arriba. Cuando solo el resultado embrionario es ND, Δ tiene un límite superior. Los pares ND → ND se contabilizan debajo del grupo y no se representan en Δ = 0.",
    "ndBand": "ND (sin eje numérico)",
    "title": "Embrión, feto y niño",
    "subtitle": "Heteroplasmia en biopsias embrionarias y muestras prenatales o posnatales",
    "lead": "Comparaciones entre el embrión transferido y tejidos del feto o del niño. Las observaciones no son independientes: varias mediciones pueden proceder de distintos tejidos o momentos de un mismo niño.",
    "main": "{{pairs}} de {{children}} fetos y niños. {{disc}}",
    "discOne": "Todas las comparaciones clasificadas aquí como discordantes ({{ids}}) corresponden a un niño cuyas muestras posnatales se analizaron mediante otro método. Aquí, discordante significa un resultado embrionario igual o inferior al 18 % junto con un resultado tisular superior al 18 %; es una agrupación descriptiva, no un umbral clínico.",
    "discMany": "Discrepancias entre embrión y tejido: {{ids}}.",
    "pairForms": [
      "comparación",
      "comparaciones",
      "comparaciones"
    ],
    "xA": "Heteroplasmia en el embrión transferido, %",
    "yA": "Heteroplasmia en tejido fetal / del niño, %",
    "yB": "Δ (tejido − embrión), p. p.",
    "prenatal": "muestras prenatales",
    "blood": "sangre / sangre de cordón",
    "otherPost": "otros tejidos posnatales",
    "identity": "y = x (valores idénticos)",
    "showExcluded": "Mostrar registros excluidos y censurados",
    "lowSpread": "Los resultados embrionarios indicados como no detectados aparecen en una banda ND separada, sin eje numérico. Los resultados numéricos exactos están disponibles en la tabla.",
    "dependency": "Comparaciones: {{pairs}}; fetos y niños: {{children}}. C5 aporta {{k}} mediciones repetidas de las {{pairs}}.",
    "excludedTitle": "No representados",
    "colorByVariant": "El color indica la variante del ADNmt; la forma, el material de la muestra; las etiquetas identifican los casos."
  },
  "model": {
    "without3pn": "Denominador adicional para m.14487T>C, excluyendo el embrión 3PN: {{sign}}18 % — {{k}}/{{n}}. El conjunto principal conserva todos los valores embrionarios publicados; un embrión 3PN no es candidato a transferencia.",
    "versionLabel": "Versión del modelo: {{v}}",
    "title": "Modelo PGT-mt × PGT-A",
    "subtitle": "Escenarios de selección conjunta mediante PGT-mt y test genético preimplantacional de aneuploidías (PGT-A), y sensibilidad a los supuestos del modelo",
    "banner": "El modelo estima la probabilidad de que al menos un blastocisto de un grupo dado cumpla ambos criterios de laboratorio. Las proporciones de entrada proceden de series publicadas heterogéneas. Estas estimaciones no son pronósticos personalizados.",
    "yAxis": "P(≥1 que cumple los criterios)",
    "xAxis": "Número de blastocistos, N",
    "panelTabs": "Proporción de blastocistos euploides del escenario",
    "panel": "Escenario E = {{p}}",
    "pHet": "H es la proporción de valores de heteroplasmia publicados iguales o inferiores al umbral seleccionado. Describe las series incluidas, no a una paciente concreta.",
    "pEupl": "E es la proporción de blastocistos euploides supuesta en el escenario",
    "pEuplSource": "Referencia",
    "meaningTitle": "Qué significa el resultado",
    "meaning": "P(≥1) es la probabilidad del modelo de que al menos uno de N blastocistos cumpla ambos criterios: euploide según PGT-A y con heteroplasmia igual o inferior al valor de corte elegido. No es la probabilidad de embarazo, de nacimiento vivo ni de tener un hijo sano, ni un pronóstico para una paciente concreta.",
    "improvement": "Para estimar los efectos de la familia y de la variante se necesitan datos completos y vinculados de los ciclos de varias familias independientes. Las proporciones de blastocistos euploides de los escenarios no están calibradas por edad.",
    "formula": "Fórmulas",
    "assumptions": "Supuestos del modelo (no demostrados)",
    "a1": "q = H × E: se supone que la heteroplasmia y el estado cromosómico son independientes;",
    "a2": "con ρ = 0, los blastocistos son ensayos independientes con la misma probabilidad; N es un número dado de blastocistos, no el número de ovocitos ni el rendimiento medio de un ciclo;",
    "a3": "con ρ > 0, los embriones comparten una probabilidad aleatoria de cumplir ambos criterios. El ρ seleccionado es un parámetro de escenario; no se ha estimado a partir de los datos del Atlas;",
    "a4": "H describe registros publicados agrupados de distintos estadios de desarrollo y métodos analíticos; E es una proporción supuesta de blastocistos euploides.",
    "tableTitle": "P(≥1) para todas las variantes del conjunto de datos",
    "smallN": "n pequeño: la proporción estimada es inestable",
    "dashed": "líneas finas de trazos largos: valor de corte del 30 %, cuando difiere del 18 %; los patrones de las líneas principales distinguen las variantes",
    "nMax": "N hasta",
    "boundary": "Regla del valor de corte",
    "rhoLabel": "Dependencia entre embriones, ρ",
    "independent": "límite superior: embriones independientes",
    "rhoNote": "ρ describe la dependencia del resultado binario de cumplir ambos criterios. Es una correlación beta-binomial especificada, no una correlación observada entre porcentajes de heteroplasmia. Se utiliza el mismo valor de escenario para todas las variantes.",
    "showRange": "Mostrar la sensibilidad a un intervalo condicional de H",
    "intervalNote": "Las bandas transforman un intervalo condicional de Wilson del 95 % para H, manteniendo E y ρ fijos. El intervalo binomial supone observaciones independientes y no tiene en cuenta la agrupación familiar, el sesgo de publicación ni el error de medición. Con ρ > 0, la banda sigue mostrando sensibilidad a la entrada; no es un intervalo estimado para embriones dependientes ni para el éxito clínico.",
    "iid95": "IC de Wilson del 95 % (sin considerar la agrupación)",
    "inputSummary": "La entrada comprende {{n}} registros de {{sources}} publicaciones: {{blastocysts}} se identifican explícitamente como blastocistos y en {{unspecified}} no se indica el estadio de desarrollo. Para {{nd}} resultados indicados como no detectados no se dispone del límite de detección. Son observaciones publicadas heterogéneas, no ciclos de tratamiento completos e independientes.",
    "inputIntervalNote": "H = k/n se calcula a partir de los registros incluidos para cada variante. El conjunto completo incluye embriones en segmentación, embriones 3PN y valores indicados solo para embriones transferidos (Hyslop 2025, Thorburn 2009). La selección por heteroplasmia baja sesga H al alza. El filtro conserva solo las biopsias del TE de blastocistos identificadas explícitamente. Los intervalos se representan por sus límites superiores; se supone que los resultados indicados como no detectados están por debajo del valor de corte. Los intervalos de Wilson no consideran la agrupación.",
    "crossing": "Intervalos que cruzan el valor de corte: {{n}}",
    "sampleComposition": "Composición de la muestra de entrada",
    "sourceCount": "Publicaciones: {{n}}",
    "stageCount": "Blastocistos: {{b}}; estadio no indicado: {{u}}",
    "ndCount": "No detectados, sin límite de detección indicado: {{n}}",
    "tableN": "Número de blastocistos para la tabla, N",
    "tableAge": "Edad {{age}}",
    "vus": "Variante de significado incierto (VUS)",
    "dependentFormula": "Para 0 < ρ < 1, la probabilidad compartida Q sigue una distribución beta de media q. Los embriones son condicionalmente independientes dado Q; la integración respecto a Q induce dependencia positiva. Con ρ = 0, se utiliza el límite binomial.",
    "boundsTitle": "Cuando el estado de heteroplasmia y la ploidía pueden estar asociados",
    "boundsNote": "Las proporciones marginales H y E solo determinan límites de la probabilidad conjunta q para un embrión. La tabla muestra esos límites, no intervalos de confianza. Están condicionados a las proporciones de entrada y no describen la dependencia entre embriones.",
    "evidenceTitle": "Resultados conjuntos de estudios primarios",
    "evidenceNote": "El criterio de valoración se fija aquí en H≤18 % y euploidía estricta. Cada denominador comprende blastocistos evaluados mediante biopsia del TE en una serie publicada. Estas series pequeñas describen a mujeres concretas portadoras de variantes del ADNmt; sus proporciones no calibran las curvas de escenario para otras familias.",
    "confirmedEuploid": "Euploidía confirmada",
    "jointPass": "Cumplen ambos criterios",
    "evidence": {
      "tofilo": "Una mujer portadora de la variante; una de las seis muestras de biopsia cumple ambos criterios.",
      "hu": "Una mujer portadora de una variante de significado incierto (VUS). Estos resultados no caracterizan a las variantes patogénicas.",
      "ji": "Una paciente, dos ciclos; PGT-A fue informativo en 14/15. El blastocisto restante tiene H=99,4 %, por lo que no cumple el criterio conjunto, independientemente de su ploidía desconocida.",
      "spathB": "Paciente B. La variante no fue detectada en ninguna muestra de biopsia; no se indicó el límite de detección. Las proporciones suponen que los resultados ND están por debajo del 18 %. Al no haber variación en el estado de H, no puede evaluarse la independencia de los dos criterios.",
      "spathD": "Paciente D. Las proporciones que incluyen resultados ND suponen un límite de detección inferior al 18 %. La proporción conjunta, 3/9, difiere del producto de las proporciones marginales, 8/27. Esta serie pequeña no permite establecer una asociación."
    },
    "salleveltNote": "Sallevelt 2017: los 3/22 registros numéricos por debajo del 18 % incluyen un valor bajo en un embrión 3PN. El rendimiento diagnóstico confirmado para 2PN es de 2/23. Cuatro análisis no son concluyentes debido a un control blanco positivo; si se aceptan las otras 19 clasificaciones, la fracción por debajo del 18 % queda limitada a 2/23–6/23. Son límites por datos incompletos, no un intervalo de confianza.",
    "publicationCarriers": "Portadoras indicadas por publicación (no sumar)",
    "correlationExample": "Ejemplo didáctico con los datos actuales: H = {{h}}, E = {{e}}, N = 6 da {{p0}} con ρ = 0 y {{p2}} con ρ = 0,2. Es un cálculo de escenario, no un pronóstico individual.",
    "scenarioNote": "Los valores de escenario no se asignan a edades concretas.",
    "symbols": "H: proporción igual o inferior al valor de corte seleccionado; E: proporción supuesta de blastocistos euploides; ◆ cálculo del modelo.",
    "teOnly": "Solo biopsias del TE de blastocistos",
    "carrierCaveat": "Con 1–2 mujeres portadoras de una variante, la proporción describe a esas mujeres, no a la variante en general. Los registros se vinculan entre publicaciones solo cuando la información disponible respalda esa correspondencia. Los recuentos se indican por separado para cada publicación; la misma mujer puede aparecer en varios artículos, por lo que no deben sumarse.",
    "unknown": "no establecido",
    "carriers": "portadoras: {{n}}; registros: {{records}}"
  },
  "data": {
    "maternalCluster": "Grupo materno",
    "embryoSample": "Muestra embrionaria",
    "day3Blastomere": "Un blastómero del día 3",
    "atlasRow": "Hoja de origen del Atlas, fila {{row}}",
    "countSummary": "{{records}} registros, incluidos {{pairs}} pares de muestras de embrión y tejido de {{children}} fetos y niños. {{pubs}} publicaciones, de las que {{embryoPubs}} aportan valores embrionarios.",
    "locator": "Ubicación en la fuente",
    "title": "Tabla de valores",
    "lead": "Todas las observaciones, con la procedencia de cada valor. Las descargas CSV utilizan etiquetas y notas en inglés; los identificadores y los datos numéricos no cambian.",
    "embryos": "Embriones (Entre distintos embriones)",
    "offspring": "Embrión, feto y niño",
    "filterVariant": "Variante",
    "filterSource": "Fuente",
    "search": "Buscar (ID, ID anterior, variante, fuente)",
    "release": "Versión actual: {{n}} valores de heteroplasmia embrionaria. Versión inicial congelada {{base}}: {{nBase}} valores. Cambios desde la versión inicial: {{changes}} (véase Métodos).",
    "csvTitle": "Tablas de la base de datos (CSV)",
    "version": "Versión {{v}}; archivo de origen {{file}} (SHA-256 {{sha}}…)"
  },
  "cases": {
    "phenotype": "Fenotipo",
    "title": "Casos",
    "lead": "Casos y series de casos publicados, incluidos los niveles de heteroplasmia, los tejidos analizados y los desenlaces descritos. Se omiten los datos médicos personales; cada valor numérico conserva la atribución de su fuente.",
    "range": "Intervalo entre embriones",
    "transferred": "Embrión transferido",
    "offspring": "Tejidos fetales / del niño",
    "dataType": "Tipo de datos",
    "origin": "Procedencia del valor"
  },
  "sources": {
    "verificationSummary": "DOI contrastados con PubMed el 11 de octubre de 2026; los PMID se muestran en la tabla. Las excepciones identifican publicaciones sin registro en PubMed.",
    "title": "Fuentes",
    "lead": "Publicaciones que sustentan los valores del conjunto de datos, las líneas de referencia de los gráficos y los parámetros del modelo. Cada entrada identifica el estudio primario, sus autores y su DOI.",
    "rolesTitle": "Uso en el Atlas",
    "filter": "Mostrar",
    "filterData": "con valores en el conjunto de datos",
    "filterOther": "referencias, modelo y casos",
    "colPublication": "Publicación",
    "colType": "Tipo",
    "colRecords": "Registros",
    "colRoles": "Dónde se utiliza",
    "roleShort": {
      "observations": "observaciones",
      "case_summary": "casos publicados",
      "threshold": "valor de referencia en los gráficos",
      "model_parameter": "modelo PGT-mt × PGT-A",
      "excluded_data": "considerados, no incluidos",
      "classification_basis": "clasificación de la variante"
    },
    "roles": {
      "observations": "observaciones: valores individuales de heteroplasmia ({{section}})",
      "case_summary": "resumen de un caso o una serie publicados (Casos)",
      "threshold": "línea de referencia en los gráficos ({{section}})",
      "model_parameter": "parámetro del modelo de escenarios: proporción de blastocistos euploides según la edad",
      "excluded_data": "datos revisados y no incluidos (motivo en Métodos)",
      "classification_basis": "fundamento de la clasificación de {{section}}"
    },
    "sections": {
      "heteroplasmy-landscape": "Entre distintos embriones",
      "embryo-concordance": "Dentro de un mismo embrión",
      "embryo-to-offspring": "Embrión, feto y niño"
    },
    "doiException": "Excepción de DOI",
    "records": "registros en el conjunto de datos",
    "verified": "Verificado",
    "supplementary": "Material complementario"
  },
  "contribute": {
    "title": "Aportar datos",
    "kicker": "Contribuciones internacionales a la base de evidencia",
    "motto": "Todos los desenlaces importan. Los resultados desfavorables también son datos.",
    "lead": "PGT-mt Atlas recibe aportaciones de grupos de investigación y clínicas de todo el mundo. Si ha realizado PGT-mt o estudiado embriones portadores de variantes del ADNmt, sus resultados pueden ayudar a describir el método de forma más completa, incluidos los ciclos sin éxito y los embriones no transferidos.",
    "downloadTemplate": "Descargar la plantilla (.xlsx)",
    "contactLink": "Contactar con el curador",
    "templateMeta": "Envío de datos de investigación de PGT-mt · versión {{v}} · {{date}} · Excel",
    "why": {
      "title": "Por qué cada resultado cuenta",
      "note": "sesgo de publicación",
      "p1": "Los resultados favorables de PGT-mt se publican con más frecuencia que los desfavorables. Es más probable que se publique un ciclo que culmina en el nacimiento de un niño sano que uno sin embriones que cumplan los criterios, con fallo de implantación o con pérdida gestacional.",
      "p2": "Por ello, la literatura puede ofrecer una imagen sesgada que sugiera que casi siempre se dispone de un embrión que cumpla los criterios y que los desenlaces son predecibles. Los resultados desfavorables siguen estando infrarrepresentados, aunque las familias necesitan esa información en el asesoramiento genético.",
      "p3": "El Atlas registra todos los desenlaces con el mismo cuidado. Comunicar un resultado desfavorable ayuda a completar y precisar la evidencia disponible."
    },
    "cycles": {
      "title": "Por qué importan los ciclos completos",
      "note": "del ovocito al niño",
      "lead": "Para estimar con qué frecuencia PGT-mt conduce a una transferencia embrionaria y a un nacimiento vivo se necesita un denominador completo: todos los ovocitos y embriones del ciclo, incluidos los no transferidos. Un ciclo puede terminar en cualquiera de las etapas siguientes; cada desenlace aporta información.",
      "steps": [
        "ovocitos recuperados",
        "maduros (MII)",
        "fecundados (2PN)",
        "blastocistos",
        "biopsia y PGT-mt",
        "embrión apto",
        "transferencia",
        "embarazo",
        "nacimiento vivo y seguimiento"
      ],
      "losses": [
        "ovocitos inmaduros y degenerados",
        "ovocitos no fecundados",
        "detención del desarrollo",
        "sin resultado del análisis",
        "sin embrión apto",
        "sin implantación",
        "pérdida gestacional"
      ],
      "lossesTitle": "Etapas en las que puede terminar un ciclo: todos los desenlaces cuentan:",
      "p": "Las mediciones de heteroplasmia de todos los embriones de un ciclo, incluidos los aneuploides, los que presentan una detención del desarrollo y los no transferidos, ayudan a describir la transmisión de una variante del ADNmt durante la ovogénesis y el desarrollo temprano. Sin estas observaciones, las estimaciones del riesgo para una familia son incompletas."
    },
    "interest": {
      "title": "Datos que recibimos",
      "note": "estudios y observaciones",
      "items": [
        "Ciclos completos de PGT-mt: todos los ciclos iniciados, incluidos los que terminaron sin transferencia.",
        "Valores de heteroplasmia de todos los embriones, no solo de los transferidos; resultados del PGT-A y de la morfología.",
        "Estudios de embriones donados para investigación: biopsia del trofoectodermo frente a masa celular interna y trofoectodermo restante, biopsias repetidas y blastómeros individuales.",
        "Ovocitos y corpúsculos polares; heteroplasmia en los tejidos de la portadora.",
        "Diagnóstico prenatal y seguimiento posnatal de los niños, con indicación del tejido, la edad y el método.",
        "Resultados desfavorables e inesperados: ausencia de embriones que cumplan los criterios, fallo de implantación, pérdida gestacional o resultados discordantes entre el embrión y el tejido fetal.",
        "Datos metodológicos: validación, límite de detección, linealidad, efectos de la amplificación del genoma completo y mediciones repetidas.",
        "Estudios publicados todavía no incluidos en el Atlas: basta con la referencia y la ubicación de los valores en el artículo."
      ]
    },
    "how": {
      "title": "Cómo contribuir",
      "note": "paso a paso",
      "steps": [
        [
          "Escribir al curador",
          "Describa brevemente el estudio, el tamaño del conjunto de datos y su estado de publicación."
        ],
        [
          "Completar la plantilla",
          "Descargue la plantilla de envío de datos de investigación de PGT-mt y complete las hojas pertinentes para sus datos. Para proponer un estudio publicado, envíe su referencia o DOI."
        ],
        [
          "Acordar cómo compartir los datos",
          "El curador propondrá un canal seguro para el archivo. Los datos de pacientes nunca se envían por correo sin cifrar ni se suben al sitio web o a GitHub."
        ],
        [
          "Revisión científica",
          "El curador revisa la integridad, la coherencia, el solapamiento con datos publicados, la autorización, los permisos, la desidentificación y los requisitos éticos, y contacta con los autores cuando se necesitan aclaraciones."
        ],
        [
          "Decisión y reconocimiento",
          "Se recibe una decisión motivada. Los valores incluidos aparecen en el Atlas con su fuente y sus autores."
        ]
      ]
    },
    "template": {
      "detailsTitle": "Detalles de la plantilla: hojas, instrucciones de cumplimentación y desidentificación",
      "title": "Una plantilla estructurada para datos de investigación",
      "note": "plantilla Excel",
      "lead": "La plantilla de envío de datos de investigación de PGT-mt recoge el conjunto mínimo de datos de un ciclo de PGT-mt —paciente y ciclo, embrión, método y desenlace—, con campos adicionales para ciclos completos y resultados desfavorables. Sus hojas vinculadas describen cada ovocito, embrión, muestra y desenlace sin identificadores directos.",
      "sheetsTitle": "Hojas de la plantilla",
      "fields": "{{n}} campos, {{r}} obligatorios",
      "extra": "También incluye instrucciones (EN/RU), un diccionario de datos con la definición, la unidad y los valores permitidos de cada campo y listas desplegables.",
      "rulesTitle": "Cero, dato ausente y resultado inferior al límite de detección son conceptos distintos",
      "rules": [
        "Una celda vacía significa «no comunicado / desconocido».",
        "0 en un recuento significa «se contó, ninguno».",
        "Por debajo del límite de detección es un tipo de valor propio (below_lod), con el límite indicado; no es 0.",
        "Los intervalos o límites publicados se conservan tal como se publicaron; no se imputa un punto medio.",
        "Un análisis fallido o no realizado permanece en la tabla porque forma parte del registro del ciclo."
      ],
      "privacyTitle": "Sin identificadores directos",
      "privacy": "La plantilla no contiene campos para nombres, iniciales, fechas exactas de nacimiento o de procedimientos, direcciones, contactos de pacientes ni números de historia clínica. La edad se registra por grupos, los momentos son relativos (día del embrión, semana gestacional, edad del niño en meses) y todos los códigos están desidentificados."
    },
    "review": {
      "title": "Revisión científica",
      "note": "del envío a la inclusión",
      "lead": "Todas las aportaciones siguen el mismo proceso de revisión. Los datos enviados nunca aparecen automáticamente en los gráficos públicos. Su inclusión requiere una decisión separada del curador y una modificación revisada del conjunto de datos.",
      "figCaption": "El recorrido de los datos: tabla de un grupo de investigación (puntos rojos: resultados negativos, también necesarios), envío, revisión científica e inclusión en el Atlas; algunas aportaciones se rechazan con una explicación.",
      "labels": {
        "researcher": "grupo de\ninvestigación",
        "submitted": "recibido",
        "review": "en revisión",
        "validated": "validado",
        "atlas": "PGT-mt Atlas",
        "rejected": "rechazado"
      },
      "statusTitle": "Estados",
      "status": {
        "submitted": [
          "Recibido",
          "Se ha registrado la consulta o el archivo; no se muestra ningún dato."
        ],
        "under_review": [
          "En revisión",
          "Se revisan la integridad, la coherencia, el solapamiento, la autorización y la desidentificación; las preguntas se remiten a los autores."
        ],
        "validated": [
          "Validado",
          "Los datos han superado la revisión y se preparan para su inclusión con su nivel de evidencia."
        ],
        "included": [
          "Incluido",
          "Los valores se añaden mediante un cambio revisado independiente y se muestran con su atribución."
        ],
        "rejected": [
          "Rechazado",
          "Los datos no se incluyen; los autores reciben los motivos y pueden presentar una versión corregida."
        ]
      },
      "tiersTitle": "Niveles de evidencia",
      "tiersLead": "La fuente y el estado de la evidencia permanecen visibles junto a cada valor. Las categorías nunca se combinan sin una identificación explícita.",
      "tiers": {
        "peer_reviewed_published": [
          "Publicaciones revisadas por pares",
          "Resultados que han superado una revisión independiente por pares en una revista científica."
        ],
        "published_not_peer_reviewed": [
          "Publicado sin revisión independiente por pares",
          "Prepublicaciones, resúmenes de congresos, tesis e informes."
        ],
        "unpublished_research_data": [
          "Datos de investigación no publicados",
          "Datos de grupos de investigación y clínicas compartidos con el Atlas tras su revisión."
        ],
        "unverified_report": [
          "Informes no verificados",
          "Información que no se pudo verificar. Nunca se muestra en los gráficos."
        ]
      },
      "unpublishedTitle": "Los datos no publicados requieren además",
      "unpublished": {
        "authority": "confirmación de que el investigador está autorizado a compartir los datos en nombre de la institución o de su titular;",
        "permission": "permiso para utilizar los datos y mostrar públicamente los valores desidentificados (es posible un embargo);",
        "deidentification": "una comprobación de desidentificación: ausencia de identificadores directos o indirectos;",
        "ethics": "confirmación de los requisitos éticos: aprobación del comité de ética y consentimiento de los pacientes para el uso de los datos en investigación."
      }
    },
    "credit": {
      "title": "Reconocimiento de las contribuciones",
      "note": "se conserva la autoría",
      "items": [
        "Cada valor incluido se atribuye a su publicación primaria, autores y DOI, o al grupo de investigación e institución que hayan aportado datos no publicados.",
        "Los grupos colaboradores reciben reconocimiento en el Atlas en la forma que elijan.",
        "El Atlas está abierto a la colaboración científica. Los grupos que realicen una contribución sustancial pueden ser invitados a colaborar en publicaciones científicas conjuntas."
      ],
      "authorship": "La coautoría no es automática: se discute para cada publicación y se determina según los criterios de autoría aceptados (ICMJE)."
    },
    "contact": {
      "title": "Contactar con el curador",
      "note": "consultas científicas",
      "lead": "Para consultas científicas, aportaciones de datos o colaboración en investigación, contacte con Ilya Mazunin, creador y curador de PGT-mt Atlas.",
      "inactiveTitle": "El canal de contacto aún no está activo",
      "inactive": "El curador aún no ha elegido una dirección para consultas científicas, por lo que aquí no hay formulario ni botón de envío. Una vez elegido el canal, aparecerá un enlace para escribir un mensaje.",
      "interim": "Mientras tanto, se puede contactar con el curador mediante los perfiles profesionales indicados en su página.",
      "curatorPage": "Página del curador",
      "write": "Escribir al curador",
      "includeTitle": "Qué incluir en el primer mensaje",
      "include": [
        "nombre, cargo, institución y país;",
        "tipo de datos: publicados (DOI) o no publicados;",
        "variante(s) del ADNmt y número de ciclos, embriones y desenlaces;",
        "si se incluyen resultados desfavorables y ciclos completos;",
        "su método seguro preferido para compartir un archivo de datos."
      ],
      "subjectLabel": "Asunto",
      "subject": "Aportación de datos de PGT-mt",
      "body": "Estimado Dr. Mazunin:\n\nNombre, cargo, institución y país:\nTipo de datos (publicados — DOI / no publicados):\nVariante(s) del ADNmt:\nNúmero de ciclos / embriones / desenlaces:\nInclusión de resultados desfavorables y ciclos completos:\n\nNo adjunto información médica sobre pacientes a este mensaje.",
      "warning": "No adjuntar información médica de pacientes a la consulta. Los archivos de datos solo se envían después de acordar un canal seguro."
    }
  },
  "about": {
    "title": "Acerca del Atlas"
  },
  "patients": {
    "title": "Para pacientes y familias",
    "tocLabel": "En esta página",
    "print": "Imprimir esta página con las preguntas",
    "more": "Para más información, consulte los capítulos de Fundamentos de PGT-mt:"
  },
  "curator": {
    "title": "Ilya Mazunin",
    "role": "Creador del Atlas y responsable de la curación de sus datos",
    "contents": "Contenido",
    "photoAlt": "Ilya Mazunin",
    "profilesLabel": "Perfiles",
    "bio": "Biografía científica",
    "bioNote": "una trayectoria científica",
    "bioOther": "Biografía en ruso",
    "projectRole": "Función en el proyecto",
    "research": "Líneas de investigación",
    "researchNote": "cinco áreas",
    "career": "Trayectoria científica",
    "careerNote": "cronología",
    "current": "Cargos actuales",
    "past": "Cargos anteriores",
    "education": "Formación y títulos",
    "educationNote": "titulaciones",
    "teaching": "Libros de texto",
    "projects": "Proyectos científicos y actividades profesionales",
    "projectsNote": "más allá del laboratorio",
    "professional": "Asociaciones profesionales",
    "ventures": "Actividad empresarial",
    "pubs": "Publicaciones seleccionadas",
    "pubsNote": "por área de investigación",
    "pubsCount": "Selección de los {{original}} artículos de investigación original y las {{reviews}} revisiones del currículum; también {{patents}} patentes y registros de software.",
    "profiles": "Perfiles de investigación y contacto",
    "profilesNote": "contacto",
    "researchProfiles": "Perfiles de investigación",
    "contact": "Contacto",
    "collaboration": "Colaboración científica",
    "patients": "Consultas de pacientes",
    "pending": "pendiente de aprobación por el curador",
    "noAdvice": "Este sitio no ofrece asesoramiento médico. Las preguntas sobre su situación concreta deben tratarse con su médico y un especialista en genética clínica.",
    "coi": "Declaración de intereses",
    "coiNote": "transparencia"
  },
  "methods": {
    "title": "Métodos y limitaciones"
  },
  "fundamentals": {
    "title": "Fundamentos de PGT-mt",
    "kicker": "Bases científicas y formación",
    "lead": "Un curso de seis capítulos sobre genética mitocondrial, heteroplasmia, cuello de botella genético, desarrollo embrionario y biopsia, métodos de PGT-mt e interpretación de resultados. Las afirmaciones científicas están vinculadas a publicaciones primarias.",
    "howTo": "Cada capítulo ofrece dos niveles: «Conceptos básicos» explica los conceptos clave en un lenguaje accesible; «Avanzado» examina los mecanismos, las limitaciones metodológicas y las fuentes primarias. Ambos niveles comparten los mismos esquemas y modelos.",
    "tocTitle": "Contenido",
    "tocNote": "seis capítulos",
    "chapter": "Capítulo {{n}}",
    "chapters": "Capítulos",
    "modelsTitle": "Modelos interactivos",
    "modelsNote": "ilustraciones de conceptos",
    "modelsText": "Los tres modelos didácticos no utilizan datos experimentales ni predicen desenlaces individuales. Las observaciones publicadas se presentan en las secciones científicas del Atlas.",
    "bibliography": "Bibliografía",
    "bibliographyNote": "fuentes citadas en toda esta sección",
    "bibliographyLead": "Publicaciones citadas en los capítulos de esta sección",
    "publicationsLink": "Publicaciones",
    "bibliographyTail": " citadas en los capítulos de esta sección",
    "disclaimer": "Material didáctico, no un protocolo clínico.",
    "level": "Nivel de lectura",
    "essentials": "Conceptos básicos",
    "advanced": "Avanzado",
    "essentialsHint": "explicación accesible",
    "advancedHint": "mecanismos y fuentes",
    "figures": "Esquemas y modelos",
    "figuresNote": "para ambos niveles",
    "toData": "De los conceptos a los datos del Atlas",
    "toDataNote": "datos reales",
    "refs": "Referencias del capítulo",
    "refsNote": "con DOI",
    "refsChecked": "Todos los DOI se contrastaron con los registros de PubMed; las excepciones se indican en cada entrada.",
    "prev": "Capítulo anterior",
    "next": "Capítulo siguiente",
    "allChapters": "Todos los capítulos",
    "usedIn": "Capítulos",
    "refStatus": {
      "pubmed": "DOI comprobado con el registro de PubMed",
      "publisher": "DOI del PDF de la editorial; no se encontró en PubMed",
      "preprint": "prepublicación, sin revisión por pares"
    },
    "het": {
      "title": "Heteroplasmia en una célula",
      "kind": "Esquema interactivo",
      "slider": "Proporción de ADNmt con la variante patogénica",
      "count": "{{m}} de {{n}} moléculas de ADNmt llevan la variante patogénica",
      "wt": "homoplasmia: solo ADNmt de tipo silvestre",
      "het": "heteroplasmia: coexisten dos tipos de ADNmt en la célula",
      "mut": "homoplasmia: solo ADNmt con la variante patogénica",
      "legendWt": "ADNmt de tipo silvestre",
      "legendMut": "ADNmt con una variante patogénica",
      "caption": "Una célula con un núcleo y cinco mitocondrias; los anillos son moléculas de ADNmt.",
      "note": "Este esquema ilustra la heteroplasmia; no modeliza el desarrollo de una enfermedad. Una célula real contiene cientos o miles de copias de ADNmt; aquí se muestran 100. La medición de una muestra promedia muchas células, que pueden tener distintos niveles de heteroplasmia. Las consecuencias funcionales dependen de la variante y del tejido (capítulo 2)."
    },
    "thr": {
      "title": "El efecto umbral",
      "kind": "Esquema",
      "x": "Nivel de heteroplasmia, %",
      "y": "Función de la cadena respiratoria",
      "a": "variante / tejido A",
      "b": "variante / tejido B",
      "zone": "umbral",
      "caption": "La relación entre heteroplasmia y función no es lineal. Cuando la proporción de ADNmt mutante es baja, las copias de tipo silvestre compensan el defecto; por encima del umbral, la función disminuye de forma pronunciada. El umbral difiere entre variantes, tejidos y complejos respiratorios [@rossignol2003]. Estas curvas esquemáticas no representan datos medidos."
    },
    "bn": {
      "title": "Simulador del cuello de botella genético",
      "kind": "Modelo interactivo",
      "h0": "Nivel inicial de heteroplasmia",
      "n": "Tamaño efectivo teórico del conjunto N",
      "count": "Ovocitos virtuales",
      "redraw": "Nuevo muestreo aleatorio",
      "axis": "Heteroplasmia en un ovocito simulado, %",
      "start": "nivel inicial",
      "summary": "Mediana {{med}} %; la mitad de los valores se sitúa entre {{q1}} % y {{q3}} %; intervalo {{min}}–{{max}} %. Desviación estándar teórica: {{sd}} p. p.",
      "banner": "Un modelo estocástico simplificado que muestra cómo el tamaño efectivo del conjunto afecta a la variación de la heteroplasmia entre ovocitos. No predice la distribución entre los embriones de una paciente concreta.",
      "modelTitle": "Modelo matemático",
      "model": "Cada ovocito virtual recibe N unidades segregantes extraídas al azar e independientemente de un conjunto en el que la proporción de ADNmt mutante es h₀. El número de unidades mutantes K sigue una distribución binomial, K ~ Bin(N, h₀); la heteroplasmia del ovocito es h = K / N. La media de h es h₀ y su varianza es h₀(1 − h₀) / N. Es un único paso de muestreo de Wright–Fisher; la distribución de Kimura utilizada para describir la segregación en portadoras lo generaliza a una deriva repetida [@otten2018].",
      "limitsTitle": "Limitaciones del modelo",
      "limits": [
        "N es una magnitud estadística teórica, no el número físico de moléculas de ADNmt en una célula; las estimaciones publicadas para portadoras varían ampliamente (por ejemplo, 10–145) [@otten2018].",
        "El modelo solo incluye deriva aleatoria: no incorpora selección, replicación preferencial, muerte celular ni maduración de ovocitos, que parecen ser relevantes para algunas variantes (capítulo 3).",
        "Los ovocitos se modelizan como independientes e idénticamente distribuidos; el modelo no incluye correlación intrafamiliar, variación entre ciclos ni efecto de la edad.",
        "No hay error de medida ni límite de detección, y no se distingue entre ovocito, embrión y biopsia."
      ],
      "seed": "muestreo n.º {{n}}"
    },
    "dev": {
      "title": "Estadios preimplantacionales",
      "kind": "Esquema",
      "caption": "Desarrollo preimplantacional humano y estadios de biopsia para PGT-mt: un blastómero en el día 3 o varias células del trofoectodermo en los días 5–6. Los tamaños son esquemáticos.",
      "labels": {
        "d1": "día 1\ncigoto",
        "d2": "día 2\n4 células",
        "d3": "día 3\n8 células",
        "d4": "día 4\nmórula",
        "d5": "días 5–6\nblastocisto",
        "bxBlastomere": "blastómero",
        "bxTe": "células TE"
      }
    },
    "bx": {
      "title": "Explorar el blastocisto y la muestra de biopsia",
      "kind": "Esquema interactivo",
      "choose": "Seleccione una estructura en el esquema o utilice los botones",
      "caption": "Un blastocisto de los días 5–6: masa celular interna a la izquierda, trofoectodermo en la periferia, cavidad (blastocele) y biopsia de varias células del trofoectodermo a través de una abertura en la zona pelúcida.",
      "origin": "Origen",
      "fate": "A qué da lugar",
      "diagnostic": "Significado diagnóstico",
      "caveat": "Limitación",
      "labels": {
        "te": "trofoectodermo",
        "icm": "masa celular\ninterna",
        "cav": "blastocele",
        "bx": "biopsia TE"
      },
      "parts": {
        "te": {
          "name": "Trofoectodermo (TE)",
          "origin": "Las células externas del embrión, que forman una capa epitelial alrededor de la cavidad durante la formación del blastocisto (días 5–6).",
          "fate": "La placenta y las membranas extraembrionarias; las células del TE no contribuyen a los tejidos fetales.",
          "diagnostic": "En la biopsia en estadio de blastocisto se toman células del TE. En muchos estudios, los niveles de heteroplasmia del TE concordaron estrechamente con los de la ICM [@treff2012; @rubens2025; @tofilo2026].",
          "caveat": "Concordancia no significa niveles idénticos. Las células individuales del TE pueden diferir, por lo que importa el número de células de la muestra de biopsia [@rubens2025]."
        },
        "icm": {
          "name": "Masa celular interna (ICM)",
          "origin": "Un grupo de células en un polo del blastocisto, separado de la capa externa durante su formación.",
          "fate": "El embrión propiamente dicho (y algunos tejidos extraembrionarios); la heteroplasmia en los derivados de la ICM es la clínicamente relevante.",
          "diagnostic": "No se toma una muestra de la ICM durante la biopsia clínica para preservar la viabilidad embrionaria. Su nivel de heteroplasmia se estudia mediante la disección de embriones que no cumplían los criterios de transferencia y fueron donados para investigación [@tofilo2026; @rubens2025].",
          "caveat": "La ICM del blastocisto todavía no es tejido fetal; la concordancia entre TE e ICM no garantiza niveles iguales en todos los tejidos del niño."
        },
        "bx": {
          "name": "Biopsia del trofoectodermo",
          "origin": "Varias células TE extraídas con una pipeta de biopsia a través de una abertura en la zona pelúcida, sin tocar la ICM.",
          "fate": "La placenta y las membranas extraembrionarias; las células del TE no contribuyen a los tejidos fetales. En este caso, sin embargo, la biopsia se utiliza para el análisis genético.",
          "diagnostic": "El nivel de heteroplasmia medido es un promedio de las células muestreadas. Los datos publicados indican que se necesitan 5–10 células para una estimación fiable [@rubens2025].",
          "caveat": "Es una muestra de células del linaje que formará la placenta, tomada en un momento concreto. El laboratorio define y valida el número de células, el procedimiento de biopsia y los métodos analíticos."
        }
      }
    }
  },
  "patientContent": {
    "intro": "Esta sección explica el test genético preimplantacional de variantes del ADN mitocondrial (PGT-mt), cómo puede ayudar y cuáles son los límites de la información que proporciona. Puede ayudarle a preparar una conversación con un especialista en genética clínica; no sustituye esa consulta.",
    "sections": [
      {
        "title": "¿Qué es el ADN mitocondrial?",
        "paragraphs": [
          "Las mitocondrias contribuyen al suministro de energía de las células. Contienen un pequeño genoma propio, denominado ADN mitocondrial (ADNmt), que los hijos heredan de su madre.",
          "Las células suelen contener cientos o miles de copias de ADNmt. Una variante patogénica es un cambio que puede causar enfermedad. Habitualmente se hereda de la madre, aunque puede aparecer por primera vez. A menudo, solo algunas copias de ADNmt contienen la variante. Su proporción se denomina nivel de heteroplasmia y se expresa como porcentaje.",
          "En una misma mujer, los niveles de heteroplasmia pueden diferir entre sangre, orina, músculo y cada uno de sus óvulos (ovocitos).",
          "PGT-mt es útil cuando una mujer porta una variante patogénica del ADNmt en estado heteroplásmico: algunas copias contienen la variante y otras no. Si todas las copias la contienen (homoplasmia), el análisis no permite identificar un embrión con una proporción inferior. Si la enfermedad se debe a una variante de un gen nuclear, se necesita otro análisis, PGT-M. Los hombres no transmiten variantes del ADNmt a sus hijos."
        ]
      },
      {
        "title": "Cómo funciona PGT-mt",
        "paragraphs": [
          "Durante la fecundación in vitro (FIV), se toman células el día 3 o los días 5–6. Normalmente, se trata de un blastómero (una célula del embrión temprano) el día 3, o de varias células del trofoectodermo los días 5–6. El trofoectodermo es la capa externa que contribuye a la placenta. El laboratorio mide la proporción de ADNmt con la variante en esa muestra.",
          "Los embriones de una misma mujer pueden tener distintos niveles de heteroplasmia. El análisis ayuda a identificar el embrión con el nivel más bajo, siempre que esté por debajo de un valor de corte acordado previamente con el especialista en genética clínica para la variante concreta. Si todos los embriones superan ese valor, generalmente no se recomienda la transferencia.",
          "El resultado no puede predecirse con precisión antes de comenzar un ciclo. El número de embriones con heteroplasmia baja varía entre pacientes y entre ciclos de tratamiento; algunos ciclos no producen ninguno."
        ]
      },
      {
        "title": "¿Por qué un porcentaje no es un diagnóstico?",
        "paragraphs": [
          "PGT-mt compara los niveles de heteroplasmia embrionaria con un valor de corte acordado. No permite determinar si el futuro niño desarrollará una enfermedad mitocondrial.",
          "El análisis mide la proporción de ADNmt con la variante en una o varias células en un único momento. La salud del niño depende de cómo se distribuya esa variante entre los tejidos y órganos en etapas posteriores del desarrollo.",
          "No existe un porcentaje de heteroplasmia «seguro» universal. Los valores de referencia publicados proceden de distintos tipos de evidencia: el 18 % es una estimación basada en mediciones musculares de portadores adultos, mientras que el 30 % es un criterio de selección embrionaria utilizado por un programa clínico. Los umbrales difieren entre variantes del ADNmt y ningún valor garantiza un niño sano. El capítulo 6 del curso de fundamentos explica estas diferencias."
        ]
      },
      {
        "title": "PGT-mt y análisis cromosómico (PGT-A)",
        "paragraphs": [
          "El número de cromosomas también influye en las posibilidades de embarazo y en la salud del niño. PGT-mt puede combinarse en la misma muestra con el test genético preimplantacional de aneuploidías (PGT-A), que evalúa el número de cromosomas. El médico y la familia deciden si utilizarlo, teniendo en cuenta la edad materna.",
          "A medida que aumenta la edad materna, disminuye la proporción de embriones con el número esperado de cromosomas. Con frecuencia, esto limita la selección embrionaria más que la heteroplasmia del ADNmt."
        ]
      },
      {
        "title": "El riesgo se reduce, no se elimina",
        "paragraphs": [
          "Los datos publicados indican que PGT-mt reduce el riesgo de transmitir una enfermedad mitocondrial, pero no lo elimina.",
          "Hable con su médico sobre el diagnóstico prenatal antes de cualquier transferencia tras PGT-mt, incluso si la variante no fue detectada en la muestra de biopsia. «No detectada» significa que el análisis no detectó la variante dentro de sus límites analíticos; no establece un «0 %».",
          "Puede que no haya ningún embrión en el que la variante esté completamente ausente. Por ello, los médicos planifican de antemano el seguimiento durante el embarazo y después del nacimiento.",
          "Su médico también puede ayudarle a preparar un plan individual de seguimiento de la salud y el desarrollo del niño después del nacimiento."
        ]
      },
      {
        "title": "¿Qué otras opciones existen?",
        "paragraphs": [
          "PGT-mt es una de varias opciones reproductivas:"
        ],
        "items": [
          "Diagnóstico prenatal: análisis durante el embarazo mediante vellosidades coriónicas o líquido amniótico. Para una variante homoplásmica, medir únicamente su proporción no permite predecir si el niño estará afectado.",
          "Óvulos de donante: uso de ovocitos de una donante sana. El niño heredará el ADN nuclear y el ADNmt de la donante del óvulo, en lugar de los de la madre receptora.",
          "Donación mitocondrial: transferencia del material nuclear de la paciente a un ovocito o cigoto de donante que contiene ADNmt sin la variante patogénica. Su disponibilidad depende de la legislación de cada país. Una pequeña cantidad de ADNmt materno puede transferirse junto con el material nuclear, por lo que el riesgo se reduce, pero no se elimina."
        ],
        "closingTitle": "¿Cómo elegir?",
        "closing": "No hay una opción única adecuada para todas las personas. La elección depende de la variante del ADNmt, los antecedentes familiares, las técnicas disponibles y el acceso al tratamiento. Las decisiones son individuales y deben tomarse mediante una conversación abierta con el especialista en reproducción y el especialista en genética clínica."
      }
    ],
    "questions": {
      "title": "¿Qué preguntar al especialista en genética clínica?",
      "intro": "Una lista de preguntas puede ayudarle a recordar qué preguntar durante la consulta:",
      "groups": [
        {
          "title": "Sobre su situación",
          "items": [
            "«¿Qué variante patogénica del ADNmt porto y qué indica la evidencia actual sobre ella?»",
            "«¿Cuál es el nivel de heteroplasmia en mis tejidos, como la sangre o las células epiteliales, y qué puede indicar sobre su transmisión a mis óvulos?»"
          ]
        },
        {
          "title": "Sobre el test preimplantacional y la selección embrionaria",
          "items": [
            "«¿Qué valor de corte de heteroplasmia recomienda para la selección embrionaria en mi caso y por qué?»",
            "«¿Se realizará PGT-mt al mismo tiempo que PGT-A (análisis de alteraciones cromosómicas)?»"
          ]
        },
        {
          "title": "Sobre la planificación y los riesgos",
          "items": [
            "«¿Cuáles serán los siguientes pasos y las alternativas si este ciclo no produce ningún embrión con heteroplasmia baja?»"
          ]
        },
        {
          "title": "Sobre el embarazo y la salud del niño",
          "items": [
            "«¿Qué seguimiento especial o diagnóstico prenatal se necesitará durante el embarazo y cómo vigilaremos la salud del niño después del nacimiento?»"
          ]
        }
      ],
      "closing": "Puede guardar o imprimir esta lista, llevarla a la consulta y añadir notas durante la conversación con su médico."
    },
    "glossary": {
      "title": "Explicación de los términos",
      "items": [
        [
          "ADNmt",
          "El pequeño genoma que se encuentra en las mitocondrias."
        ],
        [
          "Variante patogénica",
          "Un cambio en el ADN que puede causar enfermedad."
        ],
        [
          "Heteroplasmia",
          "La presencia de distintas versiones de ADNmt en una misma célula o muestra."
        ],
        [
          "Homoplasmia",
          "La misma variante en todas las copias de ADNmt."
        ],
        [
          "Nivel de heteroplasmia",
          "La proporción de copias de ADNmt que contienen la variante analizada, expresada como porcentaje."
        ],
        [
          "Muestra de biopsia",
          "Una pequeña muestra de células extraídas para el análisis."
        ],
        [
          "Blastómero",
          "Una célula de un embrión temprano."
        ],
        [
          "Trofoectodermo",
          "La capa celular externa de un blastocisto, que contribuye a la placenta."
        ],
        [
          "Ovocito y cigoto",
          "Un ovocito es un óvulo; un cigoto es la célula formada después de la fecundación."
        ],
        [
          "Material nuclear",
          "El ADN del núcleo celular, distinto del ADNmt."
        ]
      ]
    }
  },
  "interfaceCopy": {
    "Methods": {
      "collectedTitle": "Recopilación de datos",
      "datasetSummary": "Los valores individuales de heteroplasmia embrionaria se extrajeron de estudios publicados. El conjunto actual contiene {{v0}} valores de {{v1}} variantes del ADNmt; {{v2}} blastocistos con mediciones en varias muestras (biopsia TE, ICM, TE restante o ICM+TE combinada); y mediciones prenatales o posnatales de {{v3}} fetos y niños con un resultado de heteroplasmia correspondiente al embrión transferido. Se utilizaron publicaciones primarias cuando estaban disponibles. Los valores obtenidos de revisiones por no disponer de la fuente primaria se identifican explícitamente.",
      "incompleteCycles": "Los estudios no siempre describen todos los embriones de un ciclo, por lo que el conjunto de datos no representa todos los embriones de los ciclos incluidos. Agrupar casos publicados no proporciona una tasa de éxito clínico de PGT-mt.",
      "sizeTitle": "Tamaño del conjunto de datos",
      "measure": "Medida",
      "count": "Recuento",
      "representationTitle": "Cómo se representan los valores",
      "undetectedMeaning": "Cuando «0» representa un resultado indicado como no detectado, no establece la ausencia molecular completa de la variante. El límite de detección se muestra solo cuando la fuente lo indica.",
      "intervalMeaning": "Si solo se publicó un intervalo, se conservan sus límites; no se imputa un punto medio.",
      "derivationMeaning": "Cada valor va acompañado de información sobre cómo se obtuvo. Solo se asigna una etiqueta de obtención cuando la regla correspondiente está documentada en el libro de datos suplementarios:",
      "landscapeValues": "Valores de la sección «Entre distintos embriones»",
      "pointProvenance": "Cada punto remite a su fila del libro de datos suplementarios y a la publicación (DOI).",
      "guidesTitle": "Líneas de referencia en los gráficos",
      "checked": "Comprobado",
      "guideCaveat": "Ninguno de estos valores define un umbral seguro para un embrión concreto. Los tres valores de referencia publicados (18, 15–30 y 30 %) abordan preguntas diferentes y proceden de distintos tejidos, métodos y desenlaces.",
      "limitationsTitle": "Limitaciones",
      "heterogeneousStudies": "El conjunto de datos es descriptivo y no permite un metaanálisis: los estudios difieren en el estadio de biopsia, los métodos analíticos y los límites de detección.",
      "publicationBias": "Los ciclos con éxito se publican con más frecuencia que los ciclos sin éxito; no hay datos para corregir este sesgo.",
      "dependentEmbryos": "Los embriones no son observaciones independientes. Muchos proceden de la misma paciente y del mismo ciclo, y las variantes están representadas de forma desigual. Una proporción agrupada no estima el riesgo individual.",
      "dependentChildSamples": "En las comparaciones entre embrión y niño, varias mediciones corresponden al mismo niño (distintos tejidos, edades, métodos y laboratorios).",
      "scenarioModel": "El modelo PGT-mt × PGT-A calcula escenarios, no pronósticos individuales. La dependencia entre embriones es un parámetro de escenario supuesto, no una correlación estimada a partir de datos familiares.",
      "classificationTitle": "Clasificación de la variante",
      "classificationMeaning": "Las clasificaciones de las variantes proceden del libro de datos suplementarios. El Atlas no clasifica las variantes de forma independiente, tampoco a partir del nivel de heteroplasmia. Cada clasificación va acompañada de la afirmación que la sustenta en la publicación primaria y de la fecha de comprobación. En esta revisión no se contrastaron las variantes con MITOMAP ni con ClinVar.",
      "variant": "Variante",
      "variantClass": "Clase",
      "basis": "Fundamento",
      "reportingTitle": "Qué comunicar sobre un ciclo de PGT-mt",
      "reportPatient": "Paciente y ciclo: edad; antecedentes familiares; niveles de heteroplasmia en los tejidos de la portadora; número de ovocitos; fecundación y desarrollo embrionario.",
      "reportEmbryo": "Embrión: día de biopsia; morfología; resultado de PGT-A; heteroplasmia en cada muestra, para todos los embriones, incluidos los no transferidos.",
      "reportMethod": "Método analítico: amplificación del genoma completo; región diana; linealidad; límite de detección; controles.",
      "reportOutcome": "Desenlace: diagnóstico prenatal y seguimiento posnatal con tejido, edad y método."
    },
    "Cases": {
      "primaryAttribution": "La fuente primaria de cada caso figura en la columna Fuente: autores, publicación y DOI."
    },
    "Concordance": {
      "pathogenicShort": "patog.",
      "medianBar": "barra roja",
      "rangeSummary": "Mediana de la amplitud: {{v0}} p. p. ({{v1}} blastocistos con variantes patogénicas), {{v2}} p. p. (HV2), {{v3}} p. p. (los {{v4}}); estadio de segmentación: {{v5}} p. p. (n = {{v6}}).",
      "range": "Amplitud",
      "blastomeres": "Blastómeros",
      "rangePp": "Amplitud (máximo − mínimo), p. p.",
      "cells": "Células",
      "coverage": "Profundidad, ×"
    },
    "Offspring": {
      "panelA": "A",
      "panelB": "B",
      "comparisonSummary": "De {{v0}} comparaciones con heteroplasmia embrionaria baja, {{v1}} presentaron heteroplasmia tisular baja o un resultado indicado como no detectado. Todas las comparaciones clasificadas aquí como discordantes ({{v2}}) corresponden a un niño cuyas muestras posnatales se analizaron mediante otro método.",
      "referenceView": "En la vista de referencia",
      "yes": "sí",
      "no": "no"
    },
    "ScienceIndex": {
      "landscapeSummary": "{{v0}} {{values}} de {{variants}} {{variantWord}} del ADNmt",
      "concordanceSummary": "{{v0}} {{blastocysts}} + {{v1}} {{embryos}} en segmentación",
      "offspringSummary": "{{v0}} {{comparisons}}, {{v1}} fetos y niños",
      "scenarioSummary": "cálculo de escenarios",
      "lead": "El Atlas tiene cuatro secciones científicas. Los gráficos se abren en la vista de referencia; los filtros adicionales se identifican como «vista ampliada». Cada punto enlaza con la publicación primaria y la fila correspondiente del libro de datos de origen."
    }
  },
  "methodLabels": {
    "countLabels": {
      "landscape_values": "valores de heteroplasmia embrionaria",
      "landscape_variants": "variantes del ADNmt en la distribución de heteroplasmia",
      "concordance_blastocysts": "blastocistos con mediciones en varias muestras",
      "concordance_records": "registros de muestras de blastocistos",
      "cleavage_embryos": "embriones en segmentación (dos blastómeros)",
      "offspring_records": "registros de embrión → descendencia",
      "offspring_children": "fetos y niños en todos los registros de embrión–descendencia (incluidos los excluidos)",
      "offspring_children_exact_pair": "fetos y niños con pares de muestras de embrión y tejido en el conjunto representado",
      "publications": "publicaciones"
    },
    "thresholdRoles": {
      "study_estimate": "estimación del riesgo de un estudio concreto",
      "programme_criterion": "criterio de trabajo de un programa clínico",
      "literature_range": "intervalo citado en la literatura",
      "chart_convention": "convención del gráfico"
    }
  },
  "notFound": "Página no encontrada",
  "pageContents": {
    "label": "En esta página",
    "top": "Volver arriba"
  }
}

export default es
