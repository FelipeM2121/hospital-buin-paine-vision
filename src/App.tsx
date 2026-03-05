import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { LoginPage } from "./components/LoginPage";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).href;
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { ControlDocumentos } from "./components/ControlDocumentos";
import "./styles/charts-mobile.css";

const RAW = [{"item":"HSLB13000","zona":"NC-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio simple 120x70 cm","proveedor":"MELMAN SPA","cantidad":3,"piso":7,"recinto":"SALA VOLUNTARIADO","fechaInstalacion":"03/08/2026"},{"item":"HSLB13009","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio en L Administrativo","proveedor":"MELMAN SPA","cantidad":2,"piso":3,"recinto":"OFICINA SUBDIRECTOR MÉDICO","fechaInstalacion":"17/07/2026"},{"item":"HSLB13018","zona":"NC-Áreas Administrativas en General","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio en L Administrativo","proveedor":"MELMAN SPA","cantidad":3,"piso":3,"recinto":"OFICINA COMUNICACIONES","fechaInstalacion":"17/07/2026"},{"item":"HSLB13027","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio en L Administrativo","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"OFICINA SECRETARÍA","fechaInstalacion":"17/07/2026"},{"item":"HSLB13037","zona":"CM-Salas de Procedimientos no Invasivos","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio de Consultas","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SALA PROCEDIMIENTOS GINECO-OBSTÉTRICO","fechaInstalacion":"01/07/2026"},{"item":"HSLB13049","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio de Consultas","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"BOX CIRUGÍA ADULTOS","fechaInstalacion":"01/07/2026"},{"item":"HSLB13064","zona":"CM-Salas de Procedimientos no Invasivos","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio simple 120x70 cm","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SALA DE PROCEDIMIENTOS OFTALMO COMPLEJO","fechaInstalacion":"01/07/2026"},{"item":"HSLB13081","zona":"CM-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio en L Administrativo","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"SALA MULTIPROPÓSITO","fechaInstalacion":"01/07/2026"},{"item":"HSLB13090","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio de Consultas","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"BOX ENFERMERA SALUD MENTAL","fechaInstalacion":"01/07/2026"},{"item":"HSLB13100","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio de Consultas","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"BOX ENFERMERA INFANTO JUVENIL","fechaInstalacion":"01/07/2026"},{"item":"HSLB13109","zona":"CN-Salas y Habitaciones de Hospitalización","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio de Consultas","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"SALA DE ATENCIÓN","fechaInstalacion":"01/07/2026"},{"item":"HSLB13119","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio de Consultas","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"BOX ATENCIÓN ","fechaInstalacion":"01/07/2026"},{"item":"HSLB13128","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio en L Administrativo","proveedor":"MELMAN SPA","cantidad":1,"piso":6,"recinto":"OFICINA JEFE CR ATENCIÓN CERRADA","fechaInstalacion":"03/08/2026"},{"item":"HSLB13138","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio en L Administrativo","proveedor":"MELMAN SPA","cantidad":1,"piso":5,"recinto":"OFICINA JEFE MQ INFANTIL","fechaInstalacion":"17/07/2026"},{"item":"HSLB15216","zona":"CA-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Banca Madera C","proveedor":"MELMAN SPA","cantidad":1,"piso":4,"recinto":"VESTUARIO FUNCIONARIOS","fechaInstalacion":"17/07/2026"},{"item":"HSLB13155","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio en L Administrativo","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"OF. JEFE CR AT. URGENCIA","fechaInstalacion":"01/07/2026"},{"item":"HSLB13165","zona":"CN-Laboratorios","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio simple 120x70 cm","proveedor":"MELMAN SPA","cantidad":6,"piso":2,"recinto":"MÓDULO DE TRABAJO TECNÓLOGO MÉDICO","fechaInstalacion":"01/07/2026"},{"item":"HSLB13174","zona":"CN-Imagenología","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio simple 120x70 cm","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"SALA ECOTOMOGRAFO GINECO-OBSTETRICO (EQUIPO/VESTIDOR)","fechaInstalacion":"01/07/2026"},{"item":"HSLB13181","zona":"CA-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio en L Administrativo","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"OFICINA COORDINADOR ESTERILIZACIÓN","fechaInstalacion":"17/07/2026"},{"item":"HSLB13191","zona":"CM-Áreas de Rehabilitación","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio de Consultas","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"BOX INDIFERENCIADO (FONOAUDIO Y TERAPIA OCU)(1)","fechaInstalacion":"01/07/2026"},{"item":"HSLB13201","zona":"CM-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio en L Administrativo","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"OFICINA SUPERVISORA","fechaInstalacion":"01/07/2026"},{"item":"HSLB13210","zona":"NC-Áreas de Servicios Generales","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio en L Administrativo","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"OFICINA JEFE TIC","fechaInstalacion":"01/07/2026"},{"item":"HSLB13219","zona":"NC-Áreas de Servicios Generales","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio simple 120x70 cm","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"OFICINA COORDINADOR ROPERÍA","fechaInstalacion":"01/07/2026"},{"item":"HSLB13231","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio en L Administrativo","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"OF. JEFE ABASTECIMIENTO","fechaInstalacion":"01/07/2026"},{"item":"HSLB13241","zona":"NC-Áreas de Servicios Generales","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio simple 120x70 cm","proveedor":"MELMAN SPA","cantidad":4,"piso":2,"recinto":"MÓDULO DE TRABAJO EJECUTIVO DE COMPRA","fechaInstalacion":"01/07/2026"},{"item":"HSLB13249","zona":"NC-Áreas de Servicios Generales","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio en L Administrativo","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"OFICINA COORDINADOR CENTRAL","fechaInstalacion":"01/07/2026"},{"item":"HSLB13258","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio de Consultas","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"BOX DE ATENCIÓN","fechaInstalacion":"01/07/2026"},{"item":"HSLB13267","zona":"NC-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio simple 120x70 cm","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"SALA DE CAPACITACIÓN MASIVA","fechaInstalacion":"17/07/2026"},{"item":"HSLB13276","zona":"NC-Áreas Administrativas en General","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio en L Administrativo","proveedor":"MELMAN SPA","cantidad":2,"piso":1,"recinto":"MÓDULO DE TRABAJO ADMINISTRATIVOS MANTENCIÓN DE AGENDA","fechaInstalacion":"01/07/2026"},{"item":"HSLB13285","zona":"CA-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio en L Administrativo","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"SALA DE ENTREVISTAS","fechaInstalacion":"17/07/2026"},{"item":"HSLB13295","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Mesa Lateral","proveedor":"MELMAN SPA","cantidad":1,"piso":5,"recinto":"SALA DE ESTAR FAMILIARES Y ENTREVISTAS","fechaInstalacion":"17/07/2026"},{"item":"HSLB13304","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Mesa Párvulo Tipo I","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"OFICINA ASISTENTE SOCIAL PSICOPEDAGOGÍA","fechaInstalacion":"01/07/2026"},{"item":"HSLB13313","zona":"CN-Urgencia","servicio":"Urgencia","familia":"Mesa","nombre":"Mesa Plegable","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"BODEGA CATÁSTROFES ( Mesa Plegable Rectangular)","fechaInstalacion":"01/07/2026"},{"item":"HSLB13322","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Mesa Reuniones Tipo I","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"OFICINA SUBDIRECTOR MÉDICO","fechaInstalacion":"17/07/2026"},{"item":"HSLB15221","zona":"CA-Áreas de Tratamiento Especial","servicio":"Diálisis","familia":"Mesa","nombre":"Mesa Tipo Casino","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"KITCHENETTE","fechaInstalacion":"01/07/2026"},{"item":"HSLB13338","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Mesa Reuniones Tipo I","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SALA ESTIMULACIÓN COGNITIVA","fechaInstalacion":"01/07/2026"},{"item":"HSLB13347","zona":"CA-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Mesa Reuniones Tipo I","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"SALA DE ESTAR FAMILIARES","fechaInstalacion":"17/07/2026"},{"item":"HSLB13356","zona":"CM-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Mesa Reuniones Plegable","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"SALA MULTIUSO","fechaInstalacion":"01/07/2026"},{"item":"HSLB13365","zona":"NC-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Mesa Reuniones Tipo I","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SALA MULTIUSO (labores administrativas)","fechaInstalacion":"01/07/2026"},{"item":"HSLB13374","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Mesa Reuniones Tipo II","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SALA DE REUNIONES","fechaInstalacion":"01/07/2026"},{"item":"HSLB13383","zona":"NC-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Mesa Reuniones Tipo II","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SALA DE REUNIONES C/KITCHENETTE","fechaInstalacion":"01/07/2026"},{"item":"HSLB13392","zona":"NC-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Mesa Reuniones Tipo III","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"SALA DE CAPACITACIÓN PERSONALIZADA","fechaInstalacion":"17/07/2026"},{"item":"HSLB13400","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Mesa Tipo Casino Circular","proveedor":"MELMAN SPA","cantidad":2,"piso":2,"recinto":"SALA DE ESTAR /COMEDOR","fechaInstalacion":"01/07/2026"},{"item":"HSLB13409","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Mesa Tipo Casino Circular","proveedor":"MELMAN SPA","cantidad":1,"piso":5,"recinto":"ESTAR PERSONAL C/ KITCHENETTE","fechaInstalacion":"17/07/2026"},{"item":"HSLB13417","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Mesa Tipo Casino","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"ESTAR PERSONAL C/ KITCHENETTE","fechaInstalacion":"01/07/2026"},{"item":"HSLB13424","zona":"CA-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Mesa Tipo Casino Circular","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"ESTAR PERSONAL C/ KITCHENETTE","fechaInstalacion":"17/07/2026"},{"item":"HSLB13436","zona":"NC-SAMU","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Mesa Tipo Casino Circular","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"ESTAR PERSONAL","fechaInstalacion":"01/07/2026"},{"item":"HSLB13450","zona":"NC-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Mobiliario","nombre":"Caja Fuerte Tipo I","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"MÓDULO DE TRABAJO SOME RECAUDACIÓN","fechaInstalacion":"01/07/2026"},{"item":"HSLB13459","zona":"CM-Sala Cuna y Jardín Infantil","servicio":"Administración y apoyo general","familia":"Mobiliario","nombre":"Cama Apilable","proveedor":"MELMAN SPA","cantidad":14,"piso":1,"recinto":"NIVEL MEDIO MAYOR","fechaInstalacion":"01/07/2026"},{"item":"HSLB13468","zona":"CN-Urgencia","servicio":"Urgencia","familia":"Mobiliario","nombre":"Escalera Tijera","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"BODEGA DE INSUMOS CLÍNICOS","fechaInstalacion":"01/07/2026"},{"item":"HSLB13481","zona":"NC-Casino","servicio":"Comedor para funcionarios y público","familia":"Otro","nombre":"Carro Bandejero","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"E. CARROS SUCIOS","fechaInstalacion":"01/07/2026"},{"item":"HSLB13490","zona":"CM-Central de Alimentación","servicio":"Central de Alimentación ","familia":"Otro","nombre":"Carro de Transporte","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"ÁREA ARMADO DESAYUNOS, POSTRES Y COLACIONES","fechaInstalacion":"01/07/2026"},{"item":"HSLB13499","zona":"CM-Sala Cuna y Jardín Infantil","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Colchoneta Reposo A","proveedor":"MELMAN SPA","cantidad":14,"piso":1,"recinto":"NIVEL MEDIO MAYOR (120 x 60 cm)","fechaInstalacion":"01/07/2026"},{"item":"HSLB13508","zona":"CM-Sala Cuna y Jardín Infantil","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Librero","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"NIVEL MEDIO MAYOR","fechaInstalacion":"01/07/2026"},{"item":"HSLB13517","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":2,"piso":3,"recinto":"SECRETARÍA C/ARCHIVO Y FOTOCOP.","fechaInstalacion":"17/07/2026"},{"item":"HSLB13526","zona":"NC-Áreas Administrativas en General","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":3,"piso":3,"recinto":"MÓD. TRABAJO (calidad)","fechaInstalacion":"17/07/2026"},{"item":"HSLB13533","zona":"NC-Áreas Administrativas en General","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"COORDINADOR GESTIÓN DE PACIENTES","fechaInstalacion":"17/07/2026"},{"item":"HSLB13539","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"OFICINA JEFE CAE","fechaInstalacion":"17/07/2026"},{"item":"HSLB15226","zona":"CA-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"OFICINA JEFE CUIDADOS PALIATIVOS","fechaInstalacion":"01/07/2026"},{"item":"HSLB13556","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca B","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"BOX PSICÓLOGO ADULTO","fechaInstalacion":"01/07/2026"},{"item":"HSLB13563","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca B","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"BOX TERAPEUTA OCUPACIONAL","fechaInstalacion":"01/07/2026"},{"item":"HSLB13572","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"OFICINA ENFERMERA COORDINADORA","fechaInstalacion":"01/07/2026"},{"item":"HSLB13579","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca B","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SALA ESTIMULACIÓN COGNITIVA","fechaInstalacion":"01/07/2026"},{"item":"HSLB13588","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":1,"piso":6,"recinto":"OFICINA JEFE MQ ADULTO","fechaInstalacion":"03/08/2026"},{"item":"HSLB13718","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":1,"piso":4,"recinto":"SALA DE ENTREVISTAS","fechaInstalacion":"17/07/2026"},{"item":"HSLB13600","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"OF. JEFE CR AT. URGENCIA","fechaInstalacion":"01/07/2026"},{"item":"HSLB13610","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"OFICINA SECRETARÍA","fechaInstalacion":"01/07/2026"},{"item":"HSLB13619","zona":"CN-Imagenología","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":4,"piso":1,"recinto":"MÓDULO DE TRABAJO (INFORMES)","fechaInstalacion":"01/07/2026"},{"item":"HSLB13627","zona":"CM-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"MESÓN C/ARCHIVO Y FOTOCOPIADORA","fechaInstalacion":"01/07/2026"},{"item":"HSLB13640","zona":"CA-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":1,"piso":4,"recinto":"OFICINA NUTRICIONISTA","fechaInstalacion":"17/07/2026"},{"item":"HSLB13649","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":4,"piso":3,"recinto":"MÓDULOS DE TRABAJO (sala de digitalización datos)","fechaInstalacion":"17/07/2026"},{"item":"HSLB13658","zona":"NC-Áreas de Servicios Generales","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"SECRETARIA C/ARCHIVO, FOTOCOP.","fechaInstalacion":"17/07/2026"},{"item":"HSLB13667","zona":"NC-Áreas de Servicios Generales","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"SECRETARIA C/ARCHIVO, FOTOCOP.","fechaInstalacion":"17/07/2026"},{"item":"HSLB13679","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"COORDINADOR TESORERÍA","fechaInstalacion":"17/07/2026"},{"item":"HSLB13687","zona":"NC-Áreas de Servicios Generales","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"OFICINA ADMINISTRADOR DE CONTRATOS","fechaInstalacion":"01/07/2026"},{"item":"HSLB14126","zona":"CM-Áreas de Rehabilitación","servicio":"Med física y rehabilitación","familia":"Otro","nombre":"Pizarra Acrílica","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"GIMNASIO ADULTO REHABILITACIÓN CARDIOVASCULAR","fechaInstalacion":"01/07/2026"},{"item":"HSLB14135","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Velador","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"RESIDENCIA MÉDICA C/BAÑO","fechaInstalacion":"01/07/2026"},{"item":"HSLB14144","zona":"CM-Residencias Médicas","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Velador","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"RESIDENCIA MÉDICA C/BAÑO","fechaInstalacion":"01/07/2026"},{"item":"HSLB14153","zona":"CN-Imagenología","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Banca Madera A","proveedor":"MELMAN SPA","cantidad":2,"piso":1,"recinto":"SALA ECOTOMOGRAFO GINECO-OBSTETRICO (EQUIPO/VESTIDOR)","fechaInstalacion":"01/07/2026"},{"item":"HSLB14162","zona":"CM-Áreas de Rehabilitación","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Apilable de Base Ancha","proveedor":"MELMAN SPA","cantidad":10,"piso":1,"recinto":"GIMNASIO PEDIATRICO","fechaInstalacion":"01/07/2026"},{"item":"HSLB14171","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"OFICINA DIRECTOR C/BAÑO","fechaInstalacion":"17/07/2026"},{"item":"HSLB14180","zona":"NC-Áreas Administrativas en General","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"MÓD. TRABAJO (Winsig)","fechaInstalacion":"17/07/2026"},{"item":"HSLB14189","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":2,"piso":3,"recinto":"COORDINADOR GESTIÓN DEL CUIDADO AT. ABIERTA","fechaInstalacion":"17/07/2026"},{"item":"HSLB14198","zona":"CM-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"MÓDULO DE TRABAJO OIRS","fechaInstalacion":"01/07/2026"},{"item":"HSLB14207","zona":"CM-Salas de Procedimientos no Invasivos","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SALA PROCEDIMIENTOS GINECO-OBSTÉTRICO","fechaInstalacion":"01/07/2026"},{"item":"HSLB14220","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"BOX CIRUGÍA ADULTOS","fechaInstalacion":"01/07/2026"},{"item":"HSLB14233","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"BOX CARDIO OTORRINO","fechaInstalacion":"01/07/2026"},{"item":"HSLB14242","zona":"CM-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"RECAUDACIÓN ODONTOLOGÍA","fechaInstalacion":"01/07/2026"},{"item":"HSLB14251","zona":"CM-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"OFICINA ENFERMERA","fechaInstalacion":"01/07/2026"},{"item":"HSLB14260","zona":"CM-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"OFICINA JEFE SALUD MENTAL","fechaInstalacion":"01/07/2026"},{"item":"HSLB14269","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"BOX PSICÓLOGO INFANTO JUVENIL","fechaInstalacion":"01/07/2026"},{"item":"HSLB14278","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"BOX PSIQUIATRÍA ADULTO","fechaInstalacion":"01/07/2026"},{"item":"HSLB14287","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":2,"piso":1,"recinto":"ESTACIÓN DE ENFERMERÍA","fechaInstalacion":"01/07/2026"},{"item":"HSLB14295","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SALA DE ENTREVISTAS","fechaInstalacion":"01/07/2026"},{"item":"HSLB14304","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":6,"recinto":"OFICINA JEFE CR ATENCIÓN CERRADA","fechaInstalacion":"03/08/2026"},{"item":"HSLB14314","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":6,"piso":5,"recinto":"ESTACIÓN DE ENFERMERÍA","fechaInstalacion":"17/07/2026"},{"item":"HSLB14324","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":5,"recinto":"MÓDULO TRABAJO SUPERVISOR","fechaInstalacion":"17/07/2026"},{"item":"HSLB14333","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":4,"recinto":"LACTARIO","fechaInstalacion":"17/07/2026"},{"item":"HSLB14342","zona":"CA-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":3,"piso":3,"recinto":"ESTACIÓN DE ENFERMERÍA","fechaInstalacion":"17/07/2026"},{"item":"HSLB14351","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"COORDINADOR CR AT. URGENCIA","fechaInstalacion":"01/07/2026"},{"item":"HSLB14360","zona":"CN-Urgencia","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"SALA ENTREVISTA ACOGIDA","fechaInstalacion":"01/07/2026"},{"item":"HSLB14369","zona":"CN-Laboratorios","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SECCIÓN BIOQUÍMICA","fechaInstalacion":"01/07/2026"},{"item":"HSLB14378","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":2,"piso":2,"recinto":"MESÓN RECEPCIÓN","fechaInstalacion":"01/07/2026"},{"item":"HSLB14387","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"OFICINA JEFE IMAGENOLOGÍA","fechaInstalacion":"01/07/2026"},{"item":"HSLB14396","zona":"CN-Imagenología","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"SALA ECOTOMOGRAFO INDIFERENCIADO (EQUIPO/VESTIDOR)","fechaInstalacion":"01/07/2026"},{"item":"HSLB14406","zona":"CM-Farmacia General","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":4,"piso":2,"recinto":"RECEPCIÓN DESPACHO DIGITACIÓN (VENTANILLAS)","fechaInstalacion":"01/07/2026"},{"item":"HSLB14416","zona":"CA-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"MESÓN RECEPCIÓN","fechaInstalacion":"17/07/2026"},{"item":"HSLB15242","zona":"CA-Otros Servicios Adyacentes","servicio":"Pabellones","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"SALA RECUPERACIÓN URGENCIA","fechaInstalacion":"17/07/2026"},{"item":"HSLB14425","zona":"CM-Áreas de Rehabilitación","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"SALA DE TERAPIA GRUPAL (12 MAX)","fechaInstalacion":"01/07/2026"},{"item":"HSLB14434","zona":"CM-Áreas de Rehabilitación","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"SALA PREPARACIÓN DE PACIENTES","fechaInstalacion":"01/07/2026"},{"item":"HSLB14443","zona":"CM-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SECRETARIA C/ARCH. Y FOTO","fechaInstalacion":"01/07/2026"},{"item":"HSLB14452","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"MESÓN DE RECEPCIÓN","fechaInstalacion":"17/07/2026"},{"item":"HSLB14461","zona":"NC-Áreas de Servicios Generales","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"SECRETARIA C/ARCHIVO, FOTOCOP.","fechaInstalacion":"17/07/2026"},{"item":"HSLB14470","zona":"NC-Locales Externos","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"PORTERÍA c/BAÑO (1)","fechaInstalacion":"01/07/2026"},{"item":"HSLB14479","zona":"NC-Áreas de Servicios Generales","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"SECRETARIA C/ARCHIVO, FOTOCOP.","fechaInstalacion":"17/07/2026"},{"item":"HSLB14496","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"MÓDULO DE TRABAJO (presupuesto)","fechaInstalacion":"17/07/2026"},{"item":"HSLB14505","zona":"NC-Áreas de Servicios Generales","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SECRETARÍA C/ARCHIVO Y FOTOCOPIADORA","fechaInstalacion":"01/07/2026"},{"item":"HSLB14513","zona":"NC-Áreas de Servicios Generales","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"OFICINA COORDINADOR CENTRAL","fechaInstalacion":"01/07/2026"},{"item":"HSLB14522","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"COORDINADOR SALUD DEL TRABAJADOR","fechaInstalacion":"01/07/2026"},{"item":"HSLB14531","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"COORDINADOR CAPACITACIÓN Y FORMACIÓN","fechaInstalacion":"17/07/2026"},{"item":"HSLB14540","zona":"NC-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SALA MULTIUSO (labores administrativas)","fechaInstalacion":"01/07/2026"},{"item":"HSLB14549","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":6,"piso":4,"recinto":"ESTACIÓN DE ENFERMERÍA","fechaInstalacion":"17/07/2026"},{"item":"HSLB14558","zona":"NC-Áreas Administrativas en General","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"MÓDULO DE TRABAJO PROFESIONALES  DEMANDA CONSULTAS MÉDICAS","fechaInstalacion":"01/07/2026"},{"item":"HSLB14567","zona":"CM-Sala Cuna y Jardín Infantil","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Lactante","proveedor":"MELMAN SPA","cantidad":9,"piso":1,"recinto":"NIVEL SALA CUNA 2","fechaInstalacion":"01/07/2026"},{"item":"HSLB14576","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Párvulo","proveedor":"MELMAN SPA","cantidad":4,"piso":5,"recinto":"AULA HOSPITALARIA","fechaInstalacion":"17/07/2026"},{"item":"HSLB14585","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla tipo Casino","proveedor":"MELMAN SPA","cantidad":4,"piso":1,"recinto":"SALA DE ESTAR FAMILIARES","fechaInstalacion":"01/07/2026"},{"item":"HSLB14594","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla tipo Casino","proveedor":"MELMAN SPA","cantidad":4,"piso":6,"recinto":"SALA DE ESTAR FAMILIARES Y ENTREVISTAS","fechaInstalacion":"03/08/2026"},{"item":"HSLB14605","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla tipo Casino","proveedor":"MELMAN SPA","cantidad":4,"piso":2,"recinto":"ESTAR PERSONAL C/ KITCHENETTE","fechaInstalacion":"01/07/2026"},{"item":"HSLB14615","zona":"NC-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla tipo Casino","proveedor":"MELMAN SPA","cantidad":4,"piso":1,"recinto":"ESTAR PERSONAL C/ KITCHENETTE","fechaInstalacion":"01/07/2026"},{"item":"HSLB14625","zona":"NC-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Tipo Universitaria","proveedor":"MELMAN SPA","cantidad":25,"piso":3,"recinto":"SALA DE CAPACITACIÓN MASIVA","fechaInstalacion":"17/07/2026"},{"item":"HSLB14634","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":4,"piso":3,"recinto":"OFICINA SUBDIRECTOR MÉDICO","fechaInstalacion":"17/07/2026"},{"item":"HSLB14644","zona":"NC-Áreas Administrativas en General","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":3,"recinto":"OFICINA ASESOR JURÍDICO","fechaInstalacion":"17/07/2026"},{"item":"HSLB14653","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":3,"recinto":"OFICINA SECRETARÍA","fechaInstalacion":"17/07/2026"},{"item":"HSLB14662","zona":"CM-Salas de Procedimientos no Invasivos","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SALA PROCEDIMIENTOS MONITOREO FETAL","fechaInstalacion":"01/07/2026"},{"item":"HSLB14671","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":2,"recinto":"BOX MEDICINA ADULTOS","fechaInstalacion":"01/07/2026"},{"item":"HSLB14680","zona":"CM-Salas de Procedimientos no Invasivos","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SALA PROCEDIMIENTOS TRAUMATOLOGÍA INFANTIL","fechaInstalacion":"01/07/2026"},{"item":"HSLB15251","zona":"CM-Otros Servicios Adyacentes","servicio":"Odontología","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":3,"piso":2,"recinto":"ESTAC. SILLA DE RUEDAS","fechaInstalacion":"01/07/2026"},{"item":"HSLB14698","zona":"CM-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":1,"recinto":"OFICINA ENFERMERA","fechaInstalacion":"01/07/2026"},{"item":"HSLB14707","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":2,"recinto":"BOX ENFERMERA SALUD MENTAL","fechaInstalacion":"01/07/2026"},{"item":"HSLB14716","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":2,"recinto":"BOX ENFERMERA INFANTO JUVENIL","fechaInstalacion":"01/07/2026"},{"item":"HSLB14725","zona":"CN-Salas y Habitaciones de Hospitalización","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":1,"recinto":"SALA DE ATENCIÓN","fechaInstalacion":"01/07/2026"},{"item":"HSLB14734","zona":"CN-Salas y Habitaciones de Hospitalización","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":4,"piso":1,"recinto":"TALLER COMPUTACIÓN","fechaInstalacion":"01/07/2026"},{"item":"HSLB14743","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":4,"piso":2,"recinto":"SALA MULTIUSO","fechaInstalacion":"01/07/2026"},{"item":"HSLB14752","zona":"CM-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":8,"piso":2,"recinto":"SALA DE REUNIONES","fechaInstalacion":"01/07/2026"},{"item":"HSLB14761","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":6,"recinto":"OFICINA JEFE MQ ADULTO","fechaInstalacion":"03/08/2026"},{"item":"HSLB14770","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":4,"recinto":"OFICINA CHILE CRECE CONTIGO","fechaInstalacion":"17/07/2026"},{"item":"HSLB14777","zona":"CA-Sala Parto o Pabellón de Parto","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":3,"recinto":"SALA MULTIUSO","fechaInstalacion":"17/07/2026"},{"item":"HSLB14786","zona":"CN-Urgencia","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":1,"recinto":"MODULO DE TRABAJO OIRS","fechaInstalacion":"01/07/2026"},{"item":"HSLB14795","zona":"CN-Urgencia","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"BOX URGENCIA(3)","fechaInstalacion":"01/07/2026"},{"item":"HSLB14803","zona":"CN-Urgencia","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":1,"recinto":"SALA OBSERVACIÓN (INFANTIL)","fechaInstalacion":"04/05/2026"},{"item":"HSLB14813","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":2,"recinto":"OFICINA JEFE LABORATORIO","fechaInstalacion":"01/07/2026"},{"item":"HSLB14821","zona":"CN-Laboratorios","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":2,"recinto":"TOMA DE MUESTRA COMUN","fechaInstalacion":"01/07/2026"},{"item":"HSLB14830","zona":"CM-Farmacia General","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":2,"recinto":"MÓDULOS DE ENTREVISTA Y EDUCACIÓN","fechaInstalacion":"01/07/2026"},{"item":"HSLB14839","zona":"CM-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":1,"recinto":"OFICINA JEFE REHABILITACIÓN","fechaInstalacion":"01/07/2026"},{"item":"HSLB14848","zona":"CM-Áreas de Rehabilitación","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"SALA PREPARACIÓN DE PACIENTES","fechaInstalacion":"01/07/2026"},{"item":"HSLB14856","zona":"CM-Sala Mortuoria","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":1,"recinto":"MESÓN RECEPCIÓN DE REGISTRO DE INFORMES","fechaInstalacion":"01/07/2026"},{"item":"HSLB14866","zona":"NC-Áreas de Servicios Generales","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":3,"recinto":"OFICINA MEDIOAMBIENTAL","fechaInstalacion":"17/07/2026"},{"item":"HSLB14875","zona":"NC-Áreas de Servicios Generales","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":3,"recinto":"SECRETARIA C/ARCHIVO, FOTOCOP.","fechaInstalacion":"17/07/2026"},{"item":"HSLB14887","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":3,"recinto":"MÓDULO DE TRABAJO (gestión financiera)","fechaInstalacion":"17/07/2026"},{"item":"HSLB14896","zona":"NC-Áreas de Servicios Generales","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":2,"recinto":"OFICINA ADMINISTRADOR DE CONTRATOS","fechaInstalacion":"01/07/2026"},{"item":"HSLB14905","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":4,"piso":3,"recinto":"OF. JEFE CR GESTIÓN DE LAS PERSONAS","fechaInstalacion":"17/07/2026"},{"item":"HSLB14914","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":2,"recinto":"COORD. SALUD OCUP. Y PREVEN. DE RIESGOS","fechaInstalacion":"01/07/2026"},{"item":"HSLB14923","zona":"NC-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":20,"piso":3,"recinto":"AUDITORIO","fechaInstalacion":"17/07/2026"},{"item":"HSLB14932","zona":"NC-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":4,"piso":2,"recinto":"SALA MULTIUSO (labores administrativas)","fechaInstalacion":"01/07/2026"},{"item":"HSLB14941","zona":"CM-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":1,"recinto":"OFICINA 2 EDUCADORAS","fechaInstalacion":"01/07/2026"},{"item":"HSLB14950","zona":"CM-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":2,"recinto":"OFICINA ENFERMERA COORDINADORA","fechaInstalacion":"01/07/2026"},{"item":"HSLB14959","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón 1 Cuerpo","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"BOX PSICÓLOGO ADULTO","fechaInstalacion":"01/07/2026"},{"item":"HSLB14968","zona":"CN-Salas y Habitaciones de Hospitalización","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón 1 Cuerpo","proveedor":"MELMAN SPA","cantidad":2,"piso":1,"recinto":"SALA ESTAR COMEDOR","fechaInstalacion":"01/07/2026"},{"item":"HSLB14976","zona":"NC-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón 1 Cuerpo","proveedor":"MELMAN SPA","cantidad":3,"piso":2,"recinto":"SALA DE LECTURA","fechaInstalacion":"01/07/2026"},{"item":"HSLB14985","zona":"CM-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón 2 Cuerpo","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SALA ENTREVISTA A PACIENTES","fechaInstalacion":"01/07/2026"},{"item":"HSLB14994","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón 2 Cuerpo","proveedor":"MELMAN SPA","cantidad":6,"piso":5,"recinto":"SALA DE ESPERA","fechaInstalacion":"17/07/2026"},{"item":"HSLB15003","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón 2 Cuerpo","proveedor":"MELMAN SPA","cantidad":2,"piso":6,"recinto":"SALA DE ESTAR FAMILIARES Y ENTREVISTAS","fechaInstalacion":"03/08/2026"},{"item":"HSLB15010","zona":"CA-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón 2 Cuerpo","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"ESTAR PERSONAL C/ KITCHENETTE","fechaInstalacion":"17/07/2026"},{"item":"HSLB15019","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón 2 Cuerpo","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"ESTAR PERSONAL C/ KITCHENETTE","fechaInstalacion":"01/07/2026"},{"item":"HSLB15029","zona":"CM-Áreas de Rehabilitación","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón 2 Cuerpo","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"BOX PSICOLOGO / A. SOCIAL","fechaInstalacion":"01/07/2026"},{"item":"HSLB15041","zona":"CN-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón 2 Cuerpo","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"ESTAR PERSONAL C/ KITCHENETTE","fechaInstalacion":"01/07/2026"},{"item":"HSLB15050","zona":"CN-Pensionado","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón Bergere","proveedor":"MELMAN SPA","cantidad":1,"piso":5,"recinto":"SALA 1 CAMA","fechaInstalacion":"17/07/2026"},{"item":"HSLB15059","zona":"CN-Salas y Habitaciones de Hospitalización","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón Bergere","proveedor":"MELMAN SPA","cantidad":4,"piso":7,"recinto":"SALA 4 CAMAS","fechaInstalacion":"03/08/2026"},{"item":"HSLB15068","zona":"CN-Salas y Habitaciones de Hospitalización","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón Bergere","proveedor":"MELMAN SPA","cantidad":1,"piso":7,"recinto":"SALA 1 CAMA","fechaInstalacion":"03/08/2026"},{"item":"HSLB15080","zona":"CN-Salas y Habitaciones de Hospitalización","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón Bergere","proveedor":"MELMAN SPA","cantidad":4,"piso":6,"recinto":"SALA 4 CAMAS","fechaInstalacion":"03/08/2026"},{"item":"HSLB15093","zona":"CN-Salas y Habitaciones de Hospitalización","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón Bergere","proveedor":"MELMAN SPA","cantidad":1,"piso":5,"recinto":"SALA 1 CAMA","fechaInstalacion":"17/07/2026"},{"item":"HSLB15102","zona":"CN-Salas y Habitaciones de Hospitalización","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón Bergere","proveedor":"MELMAN SPA","cantidad":4,"piso":4,"recinto":"SALA 4 CAMAS","fechaInstalacion":"17/07/2026"},{"item":"HSLB15112","zona":"CA-Unidad de Paciente Crítico","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón Bergere","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"SALA 1 CAMA","fechaInstalacion":"01/07/2026"},{"item":"HSLB15121","zona":"CA-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón Bergere","proveedor":"MELMAN SPA","cantidad":1,"piso":3,"recinto":"RESIDENCIA MÉDICA","fechaInstalacion":"17/07/2026"},{"item":"HSLB15143","zona":"CM-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Sillón Tipo Poltrona","proveedor":"MELMAN SPA","cantidad":2,"piso":2,"recinto":"SALA ENTREVISTA A PACIENTES","fechaInstalacion":"01/07/2026"},{"item":"HSLB15265","zona":"NC-SAMU","servicio":"Urgencia","familia":"Mobiliario","nombre":"Cama 1 1/2 Plaza","proveedor":"MELMAN SPA","cantidad":2,"piso":1,"recinto":"RESIDENCIA DOBLE","fechaInstalacion":"01/07/2026"},{"item":"HSLB15274","zona":"CM-Sala Cuna y Jardín Infantil","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Contenedor","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"NIVEL SALA CUNA 2","fechaInstalacion":"01/07/2026"},{"item":"HSLB15172","zona":"CN-Laboratorios","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Escritorio simple 120x70 cm","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"TOMA DE MUESTRA COMUN","fechaInstalacion":"01/07/2026"},{"item":"HSLB15275","zona":"CM-Sala Cuna y Jardín Infantil","servicio":"Administración y apoyo general","familia":"Mesa","nombre":"Mesa Párvulo Inclusión","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"NIVEL SALA CUNA 2","fechaInstalacion":"01/07/2026"},{"item":"HSLB13698","zona":"NC-Áreas Adminitrativas en General","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"COORDINADOR SALUD DEL TRABAJADOR","fechaInstalacion":"01/07/2026"},{"item":"HSLB15278","zona":"NC-Otros Servicios Adyacentes","servicio":"Administración y apoyo general","familia":"Otro","nombre":"Mueble Tipo Biblioteca A","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SALA MULTIUSO (labores administrativas)","fechaInstalacion":"01/07/2026"},{"item":"HSLB15282","zona":"CM-Otros Servicios Adyacentes","servicio":"Psiquiatría","familia":"Silla","nombre":"Silla Alta Cafeteria","proveedor":"MELMAN SPA","cantidad":6,"piso":2,"recinto":"TALLER DE COCINA","fechaInstalacion":"01/06/2026"},{"item":"HSLB15292","zona":"CN-Salas y Habitaciones de Hospitalización","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"SALA DE ATENCIÓN","fechaInstalacion":"01/07/2026"},{"item":"HSLB15305","zona":"CA-Central de Esterilización","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":2,"piso":3,"recinto":"ÁREA EQUIPO AIRE COMPRIMIDO- OSMOSIS INVERSA","fechaInstalacion":"17/07/2026"},{"item":"HSLB15312","zona":"NC-Áreas de Servicios Generales","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Ergonómica","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"PREPARACIÓN DE CARROS","fechaInstalacion":"01/07/2026"},{"item":"HSLB15321","zona":"CN-Salas de Procedimientos Invasivos y/o de Mayor Complejidad","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SALA PROCEDIMIENTOS ENDOSCOPÍA INDIFERENCIADO","fechaInstalacion":"01/07/2026"},{"item":"HSLB15330","zona":"CM-Servicio Dental","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":2,"recinto":"BOX DENTAL POLIFUNCIONAL(5)","fechaInstalacion":"01/06/2026"},{"item":"HSLB15339","zona":"CM-Consultas Ambulatorias","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":1,"piso":2,"recinto":"SALA DE PROCEDIMIENTO","fechaInstalacion":"01/07/2026"},{"item":"HSLB15346","zona":"CN-Urgencia","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":1,"piso":1,"recinto":"BOX MONITOREO FETAL C / BAÑO","fechaInstalacion":"01/07/2026"},{"item":"HSLB15355","zona":"CN-Urgencia","servicio":"Administración y apoyo general","familia":"Silla","nombre":"Silla Visita","proveedor":"MELMAN SPA","cantidad":2,"piso":1,"recinto":"BOX AT. ACOGIDA C/BAÑO Y DUCHA","fechaInstalacion":"01/07/2026"}];
const SUMMARY = {
  totalItems: 1973,
  totalQty: 4456,
  uniqueRecintos: 812,
  uniqueNombres: 79,
  uniqueServicios: 39,
  uniqueZonas: 29,
  pisos: 7,
  proveedores: 3,
  familias: 4,
  byFamilia: [
    { name: "Silla", qty: 3233 },
    { name: "Mesa", qty: 694 },
    { name: "Otro", qty: 426 },
    { name: "Mobiliario", qty: 103 },
  ],
  byProveedor: [
    { name: "MELMAN SPA", qty: 4256 },
    { name: "ALLMEDICA", qty: 106 },
    { name: "COMERCIAL HAGELIN", qty: 94 },
  ],
  byPiso: [
    { name: "Piso 1", piso: 1, qty: 1466 },
    { name: "Piso 2", piso: 2, qty: 1547 },
    { name: "Piso 3", piso: 3, qty: 845 },
    { name: "Piso 4", piso: 4, qty: 184 },
    { name: "Piso 5", piso: 5, qty: 137 },
    { name: "Piso 6", piso: 6, qty: 150 },
    { name: "Piso 7", piso: 7, qty: 127 },
  ],
  byServicio: [
    { name: "Administración y apoyo general", qty: 825 },
    { name: "Consultas medicas generales", qty: 376 },
    { name: "Urgencia", qty: 311 },
    { name: "Comedor funcionarios/público", qty: 307 },
    { name: "Sala Cuna", qty: 296 },
    { name: "Hospitalización", qty: 230 },
    { name: "Hospital de día", qty: 212 },
    { name: "Psiquiatría", qty: 179 },
    { name: "UHCIP", qty: 170 },
    { name: "Laboratorio", qty: 166 },
    { name: "Med física y rehabilitación", qty: 144 },
    { name: "Imagenología", qty: 90 },
    { name: "Pabellones", qty: 86 },
    { name: "Contabilidad", qty: 83 },
    { name: "Diálisis", qty: 76 },
    { name: "Farmacia", qty: 75 },
    { name: "UTI", qty: 71 },
    { name: "Central de Alimentación", qty: 69 },
    { name: "Odontología", qty: 68 },
    { name: "Cafetería", qty: 66 },
    { name: "Consultas Ambulatorias", qty: 59 },
    { name: "Mantenimiento", qty: 52 },
    { name: "Biblioteca", qty: 52 },
    { name: "Parto Integral", qty: 48 },
    { name: "Laboratorio UMT", qty: 46 },
    { name: "Cuidados Paliativos", qty: 45 },
    { name: "Vestuario", qty: 41 },
    { name: "Auditorio", qty: 40 },
    { name: "Abastecimiento", qty: 32 },
    { name: "Esterilización", qty: 29 },
    { name: "Chile Crece Contigo", qty: 26 },
    { name: "Neonatología", qty: 25 },
    { name: "SEDILE", qty: 14 },
    { name: "Lavandería", qty: 12 },
    { name: "Morgue", qty: 11 },
    { name: "Telemedicina", qty: 8 },
    { name: "Circulación Rehabilitación", qty: 8 },
    { name: "Exterior portería", qty: 6 },
    { name: "Cirugía menor", qty: 2 },
  ],
  byNombre: [
    { name: "Silla Visita", qty: 1285 },
    { name: "Silla Ergonómica", qty: 631 },
    { name: "Silla tipo Casino", qty: 478 },
    { name: "Mueble Tipo Biblioteca A", qty: 272 },
    { name: "Silla Butaca Espera 3 Cuerpos", qty: 223 },
    { name: "Sillón Bergere", qty: 185 },
    { name: "Escritorio en L Administrativo", qty: 178 },
    { name: "Escritorio simple 120x70 cm", qty: 122 },
    { name: "Sillón 2 Cuerpo", qty: 103 },
    { name: "Mesa Tipo Casino", qty: 74 },
    { name: "Punto de Registro", qty: 67 },
    { name: "Banca Madera B", qty: 59 },
    { name: "Escritorio de Consultas", qty: 58 },
    { name: "Colchoneta Reposo A", qty: 56 },
    { name: "Mesa Reuniones Tipo I", qty: 54 },
    { name: "Silla Párvulo", qty: 52 },
    { name: "Mesa Tipo Casino Circular", qty: 41 },
    { name: "Silla Tipo Universitaria", qty: 33 },
    { name: "Mesa Lateral", qty: 31 },
    { name: "Sillón 1 Cuerpo", qty: 31 },
    { name: "Banca Madera A", qty: 29 },
    { name: "Cama Apilable", qty: 28 },
    { name: "Banca Madera C", qty: 21 },
    { name: "Perchero", qty: 20 },
    { name: "Velador", qty: 20 },
  ],
  byZona: [
    { name: "CN-Otros Serv. Adyacentes", qty: 539 },
    { name: "NC-Otros Serv. Adyacentes", qty: 536 },
    { name: "NC-Áreas Admin. en General*", qty: 559 },
    { name: "CM-Consultas Ambulatorias", qty: 387 },
    { name: "CM-Otros Serv. Adyacentes", qty: 366 },
    { name: "CN-Salas y Hab. Hospitalización", qty: 312 },
    { name: "NC-Casino", qty: 300 },
    { name: "CM-Sala Cuna y Jardín Infantil", qty: 265 },
    { name: "CA-Otros Serv. Adyacentes", qty: 251 },
    { name: "NC-Áreas Serv. Generales", qty: 206 },
    { name: "CN-Urgencia", qty: 161 },
    { name: "CM-Áreas de Rehabilitación", qty: 94 },
    { name: "CN-Laboratorios", qty: 78 },
    { name: "CM-Salas Proc. no Invasivos", qty: 59 },
    { name: "CM-Farmacia General", qty: 56 },
    { name: "CN-Imagenología", qty: 55 },
    { name: "NC-SAMU", qty: 49 },
    { name: "CA-Áreas Tratamiento Especial", qty: 45 },
    { name: "CN-Pensionado", qty: 35 },
    { name: "Otras zonificaciones", qty: 157 },
  ],
  // Datos de fechas de instalación
  byMes: [
    { name: "Mayo 2026", qty: 66 },
    { name: "Junio 2026", qty: 44 },
    { name: "Julio 2026", qty: 4069 },
    { name: "Agosto 2026", qty: 277 },
  ],
  bySemana: [
    { name: "29/06 - 05/07", qty: 2924 },
    { name: "13/07 - 19/07", qty: 1145 },
    { name: "03/08 - 09/08", qty: 277 },
    { name: "04/05 - 10/05", qty: 66 },
    { name: "01/06 - 07/06", qty: 44 },
  ],
  byDia: [
    { name: "01/07/2026", qty: 2924 },
    { name: "17/07/2026", qty: 1145 },
    { name: "03/08/2026", qty: 277 },
    { name: "04/05/2026", qty: 66 },
    { name: "01/06/2026", qty: 44 },
  ],
  fechaStats: {
    totalConFecha: 1973,
    fechaMin: "04/05/2026",
    fechaMax: "03/08/2026",
    totalMeses: 4,
    totalSemanas: 5,
  },
};

// Paleta branding Hospital Buin Paine
const COLORS = {
  primary: "#00b4d8",       // Cyan Hospital Buin Paine
  primaryDark: "#0090b0",
  primaryLight: "#67d9f0",
  green: "#10b981",         // Verde esmeralda
  greenLight: "#6ee7b7",
  orange: "#f59e0b",        // Ámbar
  orangeLight: "#fcd34d",
  red: "#ef4444",           // Rojo alerta
  redLight: "#fca5a5",
  purple: "#8b5cf6",
  blue: "#1b3a5c",          // Azul oscuro Hospital Buin Paine
  cyan: "#00b4d8",          // Cyan Hospital Buin Paine

  // Neutrales — estilo dark sidebar + light content
  bg: "#f0f6fa",            // Fondo con tinte cyan suave
  sidebar: "#0f1e2e",       // Azul marino oscuro del logo
  sidebarActive: "#162b40", // Item activo sidebar
  white: "#ffffff",
  card: "#ffffff",
  border: "#d6e8f0",
  borderLight: "#e8f4fa",

  // Textos
  text: "#0f1e2e",          // Azul marino del logo
  textMuted: "#4a6580",     // Azul grisáceo
  textLight: "#8aaec4",     // Azul claro
  textSidebar: "#7aa8c4",   // Texto sidebar inactivo
  textSidebarActive: "#ffffff",
};

const CHART_COLORS = [
  "#00b4d8",
  "#0090b0",
  "#67d9f0",
  "#1b3a5c",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
  "#f97316",
  "#3b82f6",
  "#e879f9",
];

const PIE_FAMILIA_COLORS = {
  Silla: "#00b4d8",
  Mesa: "#f59e0b",
  Otro: "#10b981",
  Mobiliario: "#1b3a5c"
};

// ── SVG Icons estilo glassmorphism / cloud (ref: Dribbble #6081093) ──────────
// Cada icono es SVG puro: formas blancas semitransparentes con efecto glass

const Icons = {
  // Resumen — gráfico de barras
  chart: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="12" width="4" height="9" rx="1.5" fill="white" fillOpacity="0.9"/>
      <rect x="10" y="7" width="4" height="14" rx="1.5" fill="white" fillOpacity="0.75"/>
      <rect x="17" y="3" width="4" height="18" rx="1.5" fill="white" fillOpacity="0.6"/>
      <rect x="3" y="3" width="18" height="1.5" rx="0.75" fill="white" fillOpacity="0.3"/>
    </svg>
  ),
  // Por Familia — categorías / carpeta
  folder: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 7C2 5.9 2.9 5 4 5H9.5L11.5 7H20C21.1 7 22 7.9 22 9V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V7Z" fill="white" fillOpacity="0.85"/>
      <path d="M2 9H22" stroke="white" strokeOpacity="0.4" strokeWidth="1.5"/>
    </svg>
  ),
  // Por Proveedor — edificio empresa
  building: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="white" fillOpacity="0.2"/>
      <rect x="3" y="3" width="18" height="5" rx="2" fill="white" fillOpacity="0.85"/>
      <rect x="6" y="10" width="3" height="3" rx="0.75" fill="white" fillOpacity="0.9"/>
      <rect x="10.5" y="10" width="3" height="3" rx="0.75" fill="white" fillOpacity="0.9"/>
      <rect x="15" y="10" width="3" height="3" rx="0.75" fill="white" fillOpacity="0.9"/>
      <rect x="6" y="15" width="3" height="3" rx="0.75" fill="white" fillOpacity="0.75"/>
      <rect x="10.5" y="15" width="3" height="3" rx="0.75" fill="white" fillOpacity="0.75"/>
      <rect x="15" y="15" width="3" height="3" rx="0.75" fill="white" fillOpacity="0.75"/>
    </svg>
  ),
  // Por Piso — pisos / capas
  layers: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L22 8L12 13L2 8L12 3Z" fill="white" fillOpacity="0.9"/>
      <path d="M2 12L12 17L22 12" stroke="white" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round"/>
      <path d="M2 16L12 21L22 16" stroke="white" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  // Por Servicio — hospital / cruz
  hospital: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="white" fillOpacity="0.2"/>
      <rect x="10.5" y="5" width="3" height="14" rx="1.5" fill="white" fillOpacity="0.9"/>
      <rect x="5" y="10.5" width="14" height="3" rx="1.5" fill="white" fillOpacity="0.9"/>
    </svg>
  ),
  // Por Producto — caja / paquete
  box: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L21 7.5V16.5L12 21L3 16.5V7.5L12 3Z" fill="white" fillOpacity="0.25"/>
      <path d="M12 3L21 7.5L12 12L3 7.5L12 3Z" fill="white" fillOpacity="0.9"/>
      <path d="M12 12V21" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M21 7.5V16.5L12 21" stroke="white" strokeOpacity="0.65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 7.5V16.5L12 21" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // Por Fecha — calendario
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="16" rx="2.5" fill="white" fillOpacity="0.2"/>
      <rect x="3" y="5" width="18" height="6" rx="2.5" fill="white" fillOpacity="0.85"/>
      <rect x="6" y="3" width="2" height="4" rx="1" fill="white" fillOpacity="0.9"/>
      <rect x="16" y="3" width="2" height="4" rx="1" fill="white" fillOpacity="0.9"/>
      <rect x="6" y="14" width="2.5" height="2.5" rx="0.5" fill="white" fillOpacity="0.8"/>
      <rect x="10.75" y="14" width="2.5" height="2.5" rx="0.5" fill="white" fillOpacity="0.8"/>
      <rect x="15.5" y="14" width="2.5" height="2.5" rx="0.5" fill="white" fillOpacity="0.8"/>
    </svg>
  ),
  // Esp. Técnicas — documento / especificación
  document: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="16" height="20" rx="2.5" fill="white" fillOpacity="0.2"/>
      <path d="M4 5.5C4 3.567 5.567 2 7.5 2H14L20 8V18.5C20 20.433 18.433 22 16.5 22H7.5C5.567 22 4 20.433 4 18.5V5.5Z" fill="white" fillOpacity="0.85"/>
      <path d="M14 2L20 8H16C14.895 8 14 7.105 14 6V2Z" fill="white" fillOpacity="0.5"/>
      <rect x="7" y="11" width="10" height="1.5" rx="0.75" fill="white" fillOpacity="0.4"/>
      <rect x="7" y="14" width="7" height="1.5" rx="0.75" fill="white" fillOpacity="0.4"/>
    </svg>
  ),
  // KPI — items / lista
  list: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2.5" fill="white" fillOpacity="0.2"/>
      <rect x="6" y="8" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.9"/>
      <rect x="10" y="8" width="8" height="2" rx="0.75" fill="white" fillOpacity="0.85"/>
      <rect x="6" y="12" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.9"/>
      <rect x="10" y="12" width="8" height="2" rx="0.75" fill="white" fillOpacity="0.85"/>
      <rect x="6" y="16" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.9"/>
      <rect x="10" y="16" width="5" height="2" rx="0.75" fill="white" fillOpacity="0.85"/>
    </svg>
  ),
  // Unidades / cantidad
  stack: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="15" width="18" height="6" rx="2" fill="white" fillOpacity="0.9"/>
      <rect x="3" y="9" width="18" height="5" rx="2" fill="white" fillOpacity="0.7"/>
      <rect x="3" y="3" width="18" height="5" rx="2" fill="white" fillOpacity="0.5"/>
    </svg>
  ),
  // Recintos / ubicación
  location: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="white" fillOpacity="0.85"/>
      <circle cx="12" cy="9" r="3" fill="white" fillOpacity="0.4"/>
    </svg>
  ),
  // Productos / tipos
  tag: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3H11L21 13L13 21L3 11V3Z" fill="white" fillOpacity="0.85"/>
      <circle cx="7.5" cy="7.5" r="1.5" fill="white" fillOpacity="0.4"/>
    </svg>
  ),
  // Búsqueda / lupa
  search: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" fill="white" fillOpacity="0.85"/>
      <circle cx="11" cy="11" r="4" fill="white" fillOpacity="0.35"/>
      <path d="M16.5 16.5L21 21" stroke="white" strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  // Árbol de carpetas / control de documentos
  tree: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="8" height="5" rx="1.5" fill="white" fillOpacity="0.9"/>
      <rect x="14" y="3" width="8" height="5" rx="1.5" fill="white" fillOpacity="0.6"/>
      <rect x="14" y="16" width="8" height="5" rx="1.5" fill="white" fillOpacity="0.6"/>
      <path d="M10 5.5H13M10 5.5V18.5H13" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="2" y="16" width="8" height="5" rx="1.5" fill="white" fillOpacity="0.9"/>
    </svg>
  ),
};

// Contenedor glass para iconos en sidebar (fondo del color activo o translúcido)
function GlassIcon({ icon, color, size = 22, active = false }: { icon: React.ReactNode; color: string; size?: number; active?: boolean }) {
  return (
    <div style={{
      width: size * 2,
      height: size * 2,
      background: active ? `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` : `${color}22`,
      borderRadius: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: active ? `0 4px 16px ${color}55` : "none",
      backdropFilter: "blur(8px)",
      transition: "all 0.2s ease",
    }}>
      <div style={{ width: size, height: size, display: "flex" }}>
        {icon}
      </div>
    </div>
  );
}

// KPI icon container — glass colored box
function KPIIcon({ icon, color, size = 52 }: { icon: React.ReactNode; color: string; size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: 16,
      background: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxShadow: `0 4px 16px ${color}40`,
    }}>
      <div style={{ width: size * 0.5, height: size * 0.5, display: "flex" }}>
        {icon}
      </div>
    </div>
  );
}

// KPI Card estilo Billy - limpio y espacioso
function KPICard({ label, value, sub, icon, color = COLORS.primary, compact = false }) {
  return (
    <div style={{
      background: COLORS.white,
      border: `1px solid ${COLORS.borderLight}`,
      borderRadius: 20,
      padding: compact ? "18px 20px" : "22px 24px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      boxShadow: "0 2px 12px rgba(99,102,241,0.06), 0 1px 3px rgba(0,0,0,0.04)",
      transition: "all 0.22s ease",
      cursor: "default",
      position: "relative",
      overflow: "hidden",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = `0 8px 28px ${color}20, 0 2px 8px rgba(0,0,0,0.06)`;
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "0 2px 12px rgba(99,102,241,0.06), 0 1px 3px rgba(0,0,0,0.04)";
      e.currentTarget.style.transform = "translateY(0)";
    }}>
      {/* Decoración fondo círculo */}
      <div style={{
        position: "absolute", right: -16, top: -16,
        width: 80, height: 80,
        borderRadius: "50%",
        background: `${color}10`,
        pointerEvents: "none",
      }} />
      {/* Ícono glass */}
      <div style={{
        width: compact ? 44 : 52,
        height: compact ? 44 : 52,
        borderRadius: 14,
        background: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 4px 12px ${color}40`,
      }}>
        <div style={{ width: compact ? 22 : 26, height: compact ? 22 : 26, display: "flex" }}>
          {icon}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11,
          color: COLORS.textMuted,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          marginBottom: 4,
        }}>
          {label}
        </div>
        <div style={{
          fontSize: compact ? 22 : 28,
          fontWeight: 800,
          color: COLORS.text,
          lineHeight: 1.1,
          letterSpacing: "-0.5px",
        }}>
          {typeof value === "number" ? value.toLocaleString("es-CL") : value}
          {sub && (
            <span style={{
              fontSize: compact ? 11 : 12,
              color: COLORS.textMuted,
              fontWeight: 500,
              marginLeft: 5,
              letterSpacing: 0,
            }}>
              {sub}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Status badge estilo Billy
function StatusBadge({ label, value, color, icon }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "16px 20px",
      background: COLORS.white,
      borderRadius: 16,
      border: `1px solid ${COLORS.borderLight}`,
      boxShadow: "0 2px 12px rgba(99,102,241,0.06), 0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        width: 48,
        height: 48,
        background: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)`,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 4px 12px ${color}40`,
        flexShrink: 0,
      }}>
        <div style={{ width: 24, height: 24, display: "flex" }}>
          {icon}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontSize: 28, 
          fontWeight: 700, 
          color: COLORS.text,
          lineHeight: 1,
          marginBottom: 4,
        }}>
          {value}
        </div>
        <div style={{ 
          fontSize: 12, 
          color: COLORS.textMuted,
          fontWeight: 500,
        }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// Sección de título limpia
function SectionTitle({ children, count, action, icon }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
      marginTop: 28,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon && (
          <div style={{
            width: 32, height: 32,
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
            borderRadius: 9,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 3px 8px ${COLORS.primary}35`,
          }}>
            <div style={{ width: 16, height: 16, display: "flex" }}>
              {icon}
            </div>
          </div>
        )}
        <h2 style={{
          fontSize: 17,
          fontWeight: 700,
          color: COLORS.text,
          margin: 0,
          letterSpacing: "-0.3px",
        }}>
          {children}
        </h2>
        {count !== undefined && (
          <span style={{
            background: `${COLORS.primary}15`,
            color: COLORS.primary,
            padding: "3px 10px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
          }}>
            {count}
          </span>
        )}
      </div>
      {action && (
        <button style={{
          background: `${COLORS.primary}12`,
          color: COLORS.primary,
          border: "none",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          padding: "6px 14px",
          borderRadius: 20,
          transition: "all 0.2s ease",
          letterSpacing: 0.3,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = `${COLORS.primary}12`; e.currentTarget.style.color = COLORS.primary; }}>
          {action}
        </button>
      )}
    </div>
  );
}

// Tooltip personalizado
function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0];
  return (
    <div style={{
      background: COLORS.sidebar,
      border: "none",
      borderRadius: 14,
      padding: "10px 16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
    }}>
      <div style={{ fontSize: 11, color: "#8b8fa8", marginBottom: 4, fontWeight: 500 }}>
        {data.payload.name || data.name}
      </div>
      <div style={{
        fontSize: 20,
        fontWeight: 800,
        color: data.color || COLORS.primary,
        letterSpacing: "-0.5px",
      }}>
        {(data.value || data.payload.qty || data.payload.value || 0).toLocaleString("es-CL")}
      </div>
    </div>
  );
}

// Tabla estilo Billy
function DataTable({ data, columns, maxRows = 10 }) {
  const [showAll, setShowAll] = useState(false);
  const display = showAll ? data : data.slice(0, maxRows);

  return (
    <div style={{
      background: COLORS.white,
      borderRadius: 18,
      overflow: "hidden",
      border: `1px solid ${COLORS.borderLight}`,
      boxShadow: "0 2px 16px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04)",
    }}>
      {/* Header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: columns.map(c => c.width || "1fr").join(" "),
        columnGap: 24,
        background: `${COLORS.primary}08`,
        borderBottom: `1px solid ${COLORS.borderLight}`,
        padding: "13px 20px",
        fontWeight: 700,
        fontSize: 11,
        color: COLORS.primary,
        letterSpacing: 0.8,
        textTransform: "uppercase",
      }}>
        {columns.map((col) => (
          <div key={col.key} style={{ textAlign: col.align || "left" }}>
            {col.label}
          </div>
        ))}
      </div>

      {/* Rows */}
      {display.map((row, i) => (
        <div key={i} style={{
          display: "grid",
          gridTemplateColumns: columns.map(c => c.width || "1fr").join(" "),
          columnGap: 24,
          padding: "13px 20px",
          borderBottom: i < display.length - 1 ? `1px solid ${COLORS.borderLight}` : "none",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = `${COLORS.primary}05`}
        onMouseLeave={(e) => e.currentTarget.style.background = COLORS.white}>
          {columns.map((col) => {
            const val = row[col.key];
            return (
              <div key={col.key} style={{
                textAlign: col.align || "left",
                fontSize: 13.5,
                color: col.highlight ? COLORS.text : COLORS.textMuted,
                fontWeight: col.highlight ? 600 : 400,
                fontFamily: col.mono ? "'SF Mono', 'Monaco', monospace" : "inherit",
              }}>
                {col.render ? col.render(val, row) : val}
              </div>
            );
          })}
        </div>
      ))}

      {/* Ver más */}
      {data.length > maxRows && (
        <div style={{
          padding: "14px 20px",
          textAlign: "center",
          borderTop: `1px solid ${COLORS.borderLight}`,
          background: `${COLORS.primary}05`,
        }}>
          <button onClick={() => setShowAll(!showAll)} style={{
            background: COLORS.primary,
            color: COLORS.white,
            border: "none",
            padding: "8px 22px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: `0 4px 12px ${COLORS.primary}40`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primaryDark; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.transform = "translateY(0)"; }}>
            {showAll ? "Mostrar menos" : `Ver ${data.length - maxRows} más`}
          </button>
        </div>
      )}
    </div>
  );
}

// Barra de progreso
function ProgressBar({ value, max, color = COLORS.primary }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ 
      background: COLORS.borderLight, 
      borderRadius: 4, 
      height: 6, 
      overflow: "hidden",
    }}>
      <div style={{
        background: color,
        width: `${pct}%`,
        height: "100%",
        borderRadius: 4,
        transition: "width 0.4s ease",
      }} />
    </div>
  );
}

// Tabla de inventario con filtros
function InventoryDataTable({ data }) {
  const [filters, setFilters] = useState({
    zona: "",
    familia: "",
    proveedor: "",
    piso: "",
    servicio: "",
    search: "",
    fechaDesde: "",
    fechaHasta: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Obtener valores únicos para filtros
  const uniqueZonas = useMemo(() => [...new Set(data.map(d => d.zona))].filter(Boolean).sort(), [data]);
  const uniqueFamilias = useMemo(() => [...new Set(data.map(d => d.familia))].filter(Boolean).sort(), [data]);
  const uniqueProveedores = useMemo(() => [...new Set(data.map(d => d.proveedor))].filter(Boolean).sort(), [data]);
  const uniquePisos = useMemo(() => [...new Set(data.map(d => d.piso))].filter(Boolean).sort((a,b) => a-b), [data]);
  const uniqueServicios = useMemo(() => SUMMARY.byServicio.map(s => s.name).sort(), []);

  // Convertir fecha DD/MM/YYYY a Date para comparar
  const parseDate = (str: string) => {
    if (!str) return null;
    const [d, m, y] = str.split("/");
    return new Date(Number(y), Number(m) - 1, Number(d));
  };

  // Filtrar datos
  const filteredData = useMemo(() => {
    const desde = filters.fechaDesde ? new Date(filters.fechaDesde) : null;
    const hasta = filters.fechaHasta ? new Date(filters.fechaHasta) : null;
    return data.filter(item => {
      const matchZona = !filters.zona || item.zona === filters.zona;
      const matchFamilia = !filters.familia || item.familia === filters.familia;
      const matchProveedor = !filters.proveedor || item.proveedor === filters.proveedor;
      const matchPiso = !filters.piso || item.piso.toString() === filters.piso;
      const matchServicio = !filters.servicio || item.servicio === filters.servicio;
      const matchSearch = !filters.search ||
        item.nombre?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.recinto?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.item?.toLowerCase().includes(filters.search.toLowerCase());
      const itemDate = parseDate(item.fechaInstalacion);
      const matchDesde = !desde || !itemDate || itemDate >= desde;
      const matchHasta = !hasta || !itemDate || itemDate <= hasta;
      return matchZona && matchFamilia && matchProveedor && matchPiso && matchServicio && matchSearch && matchDesde && matchHasta;
    });
  }, [data, filters]);

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset página cuando cambian filtros
  useEffect(() => { setCurrentPage(1); }, [filters]);

  const FilterSelect = ({ label, value, onChange, options, placeholder }) => (
    <div style={{ flex: 1, minWidth: 150 }}>
      <label style={{ 
        display: "block", 
        fontSize: 11, 
        fontWeight: 600, 
        color: COLORS.textMuted,
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: 0.5,
      }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: `1px solid ${COLORS.border}`,
          background: COLORS.white,
          fontSize: 13,
          color: COLORS.text,
          cursor: "pointer",
          transition: "border-color 0.2s ease",
        }}
        onFocus={(e) => e.target.style.borderColor = COLORS.primary}
        onBlur={(e) => e.target.style.borderColor = COLORS.border}>
        <option value="">{placeholder}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <SectionTitle icon={Icons.search}>Datos Completos del Inventario</SectionTitle>
      
      <div style={{
        background: COLORS.white,
        borderRadius: 20,
        padding: 24,
        border: `1px solid ${COLORS.borderLight}`,
        boxShadow: "0 2px 16px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04)",
        marginBottom: 24,
      }}>
        {/* Barra de búsqueda */}
        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="🔍 Buscar por nombre, recinto o código..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 12,
              border: `1.5px solid ${COLORS.borderLight}`,
              fontSize: 14,
              color: COLORS.text,
              transition: "border-color 0.2s ease",
              background: COLORS.bg,
              boxSizing: "border-box",
            }}
            onFocus={(e) => e.target.style.borderColor = COLORS.primary}
            onBlur={(e) => e.target.style.borderColor = COLORS.borderLight}
          />
        </div>

        {/* Filtros */}
        <div style={{ 
          display: "flex", 
          gap: 12, 
          marginBottom: 20,
          flexWrap: "wrap",
        }}>
          <FilterSelect
            label="Familia"
            value={filters.familia}
            onChange={(v) => setFilters({ ...filters, familia: v })}
            options={uniqueFamilias}
            placeholder="Todas las familias"
          />
          <FilterSelect
            label="Piso"
            value={filters.piso}
            onChange={(v) => setFilters({ ...filters, piso: v })}
            options={uniquePisos.map(String)}
            placeholder="Todos los pisos"
          />
          <FilterSelect
            label="Proveedor"
            value={filters.proveedor}
            onChange={(v) => setFilters({ ...filters, proveedor: v })}
            options={uniqueProveedores}
            placeholder="Todos los proveedores"
          />
          <FilterSelect
            label="Zona"
            value={filters.zona}
            onChange={(v) => setFilters({ ...filters, zona: v })}
            options={uniqueZonas}
            placeholder="Todas las zonas"
          />
          <FilterSelect
            label="Servicio"
            value={filters.servicio}
            onChange={(v) => setFilters({ ...filters, servicio: v })}
            options={uniqueServicios}
            placeholder="Todos los servicios"
          />

          {/* Filtro fecha desde */}
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={{
              display: "block",
              fontSize: 11,
              fontWeight: 600,
              color: COLORS.textMuted,
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}>
              Fecha Desde
            </label>
            <input
              type="date"
              value={filters.fechaDesde}
              onChange={(e) => setFilters({ ...filters, fechaDesde: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
                background: COLORS.white,
                fontSize: 13,
                color: COLORS.text,
                cursor: "pointer",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => e.target.style.borderColor = COLORS.primary}
              onBlur={(e) => e.target.style.borderColor = COLORS.border}
            />
          </div>

          {/* Filtro fecha hasta */}
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={{
              display: "block",
              fontSize: 11,
              fontWeight: 600,
              color: COLORS.textMuted,
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}>
              Fecha Hasta
            </label>
            <input
              type="date"
              value={filters.fechaHasta}
              onChange={(e) => setFilters({ ...filters, fechaHasta: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
                background: COLORS.white,
                fontSize: 13,
                color: COLORS.text,
                cursor: "pointer",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => e.target.style.borderColor = COLORS.primary}
              onBlur={(e) => e.target.style.borderColor = COLORS.border}
            />
          </div>

          {/* Botón limpiar filtros */}
          {Object.values(filters).some(v => v) && (
            <div style={{ flex: 1, minWidth: 150, display: "flex", alignItems: "flex-end" }}>
              <button
                onClick={() => setFilters({ zona: "", familia: "", proveedor: "", piso: "", servicio: "", search: "", fechaDesde: "", fechaHasta: "" })}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.white,
                  color: COLORS.textMuted,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = COLORS.red;
                  e.currentTarget.style.color = COLORS.white;
                  e.currentTarget.style.borderColor = COLORS.red;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = COLORS.white;
                  e.currentTarget.style.color = COLORS.textMuted;
                  e.currentTarget.style.borderColor = COLORS.border;
                }}>
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Contador de resultados */}
        <div style={{ 
          marginBottom: 16,
          fontSize: 13,
          color: COLORS.textMuted,
          fontWeight: 500,
        }}>
          Mostrando <span style={{ color: COLORS.primary, fontWeight: 700 }}>{filteredData.length}</span> de {data.length} registros
          {filteredData.length !== data.length && (
            <span style={{ marginLeft: 8 }}>
              ({((filteredData.length / data.length) * 100).toFixed(1)}% del total)
            </span>
          )}
        </div>

        {/* Tabla */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: COLORS.bg, borderBottom: `2px solid ${COLORS.border}` }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Ítem</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Nombre</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Familia</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Cant.</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Piso</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Recinto</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Proveedor</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Zona</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>Fecha Inst.</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? paginatedData.map((row, i) => (
                <tr key={i} style={{ 
                  borderBottom: `1px solid ${COLORS.borderLight}`,
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = COLORS.bg}
                onMouseLeave={(e) => e.currentTarget.style.background = COLORS.white}>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: COLORS.textMuted, fontFamily: "'SF Mono', monospace" }}>{row.item}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: COLORS.text, fontWeight: 600 }}>{row.nombre}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: COLORS.text }}>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: PIE_FAMILIA_COLORS[row.familia] ? `${PIE_FAMILIA_COLORS[row.familia]}15` : COLORS.borderLight,
                      color: PIE_FAMILIA_COLORS[row.familia] || COLORS.textMuted,
                      fontSize: 12,
                      fontWeight: 600,
                    }}>
                      {row.familia}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 14, color: COLORS.text, textAlign: "center", fontWeight: 700 }}>{row.cantidad}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: COLORS.text, textAlign: "center", fontWeight: 600 }}>{row.piso}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: COLORS.textMuted, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.recinto}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: COLORS.text }}>{row.proveedor}</td>
                  <td style={{ padding: "12px 16px", fontSize: 11, color: COLORS.textMuted, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.zona}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: COLORS.primary, textAlign: "center", fontWeight: 600, whiteSpace: "nowrap" }}>{row.fechaInstalacion}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} style={{ padding: "40px", textAlign: "center", color: COLORS.textMuted, fontSize: 14 }}>
                    No se encontraron resultados con los filtros aplicados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginTop: 20,
            paddingTop: 20,
            borderTop: `1px solid ${COLORS.borderLight}`,
          }}>
            <div style={{ fontSize: 13, color: COLORS.textMuted }}>
              Página {currentPage} de {totalPages}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: `1px solid ${COLORS.border}`,
                  background: currentPage === 1 ? COLORS.borderLight : COLORS.white,
                  color: currentPage === 1 ? COLORS.textMuted : COLORS.text,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.background = COLORS.primary;
                    e.currentTarget.style.color = COLORS.white;
                    e.currentTarget.style.borderColor = COLORS.primary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.background = COLORS.white;
                    e.currentTarget.style.color = COLORS.text;
                    e.currentTarget.style.borderColor = COLORS.border;
                  }
                }}>
                ← Anterior
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: `1px solid ${COLORS.border}`,
                  background: currentPage === totalPages ? COLORS.borderLight : COLORS.white,
                  color: currentPage === totalPages ? COLORS.textMuted : COLORS.text,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.background = COLORS.primary;
                    e.currentTarget.style.color = COLORS.white;
                    e.currentTarget.style.borderColor = COLORS.primary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.background = COLORS.white;
                    e.currentTarget.style.color = COLORS.text;
                    e.currentTarget.style.borderColor = COLORS.border;
                  }
                }}>
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── PDF Viewer con PDF.js ──────────────────────────────────────────────────
function PdfViewer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<HTMLCanvasElement[]>([]);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [basePageWidth, setBasePageWidth] = useState(0); // ancho nativo a scale=1
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pdfRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const renderTasksRef = useRef<Map<number, pdfjsLib.RenderTask>>(new Map());

  // Cancela renders anteriores y re-renderiza todas las páginas con la escala dada
  const renderAllPages = useCallback(async (pdf: pdfjsLib.PDFDocumentProxy, sc: number) => {
    // Cancelar tasks previas
    renderTasksRef.current.forEach(t => t.cancel());
    renderTasksRef.current.clear();
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: sc });
      const canvas = canvasRefs.current[i - 1];
      if (!canvas) continue;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = viewport.width * dpr;
      canvas.height = viewport.height * dpr;
      canvas.style.width = viewport.width + "px";
      canvas.style.height = viewport.height + "px";
      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);
      const task = page.render({ canvasContext: ctx, viewport });
      renderTasksRef.current.set(i, task);
      try { await task.promise; } catch { /* cancelado */ }
    }
  }, []);

  // Calcula escala ajustada al ancho del contenedor
  const calcFitScale = useCallback((pageWidth: number) => {
    const w = containerRef.current?.clientWidth ?? 900;
    return Math.max(0.3, (w - 24) / pageWidth);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setNumPages(0);
    canvasRefs.current = [];
    pdfRef.current = null;
    renderTasksRef.current.forEach(t => t.cancel());
    renderTasksRef.current.clear();

    pdfjsLib.getDocument(url).promise
      .then(async (pdf) => {
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        const firstPage = await pdf.getPage(1);
        const baseVp = firstPage.getViewport({ scale: 1 });
        setBasePageWidth(baseVp.width);
        const autoScale = calcFitScale(baseVp.width);
        setScale(autoScale);
        setLoading(false);
        setTimeout(() => renderAllPages(pdf, autoScale), 60);
      })
      .catch(() => {
        setError("No se pudo cargar el PDF.");
        setLoading(false);
      });
  }, [url, renderAllPages, calcFitScale]);

  // ResizeObserver: re-ajusta escala si cambia el ancho del contenedor
  useEffect(() => {
    if (!containerRef.current || basePageWidth === 0) return;
    const ro = new ResizeObserver(() => {
      if (!pdfRef.current) return;
      const newScale = calcFitScale(basePageWidth);
      setScale(newScale);
      renderAllPages(pdfRef.current, newScale);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [basePageWidth, calcFitScale, renderAllPages]);

  const fitToWidth = useCallback(() => {
    if (!pdfRef.current || basePageWidth === 0) return;
    const ns = calcFitScale(basePageWidth);
    setScale(ns);
    renderAllPages(pdfRef.current, ns);
  }, [basePageWidth, calcFitScale, renderAllPages]);

  const zoom = useCallback((delta: number) => {
    setScale((prev) => {
      const next = Math.min(4, Math.max(0.3, parseFloat((prev + delta).toFixed(2))));
      if (pdfRef.current) renderAllPages(pdfRef.current, next);
      return next;
    });
  }, [renderAllPages]);

  // Scroll → página actual
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      const cRect = container.getBoundingClientRect();
      canvasRefs.current.forEach((c, i) => {
        if (!c) return;
        const rect = c.getBoundingClientRect();
        if (rect.top <= cRect.top + cRect.height * 0.6 && rect.bottom >= cRect.top) {
          setCurrentPage(i + 1);
        }
      });
    };
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [numPages]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
        borderBottom: "1px solid #e5e7eb", background: "#f8fafc", flexShrink: 0,
      }}>
        <button onClick={() => zoom(-0.15)} style={btnStyle} title="Alejar">−</button>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", minWidth: 48, textAlign: "center" }}>
          {Math.round(scale * 100)}%
        </span>
        <button onClick={() => zoom(0.15)} style={btnStyle} title="Acercar">+</button>
        <button onClick={fitToWidth} style={{ ...btnStyle, width: "auto", padding: "0 10px", fontSize: 12 }} title="Ajustar al ancho">⤢ Ajustar</button>
        <span style={{ flex: 1 }} />
        {numPages > 0 && (
          <span style={{ fontSize: 12, color: "#6b7280" }}>Pág. {currentPage} / {numPages}</span>
        )}
        <a href={url} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, color: "#2563eb", fontWeight: 600, textDecoration: "none", padding: "4px 10px", border: "1px solid #2563eb", borderRadius: 6 }}>
          ↗ Nueva pestaña
        </a>
      </div>

      {/* Área de scroll — sin overflow horizontal */}
      <div ref={containerRef} style={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        background: "#525659", padding: "16px 12px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12, minHeight: 600,
      }}>
        {loading && <div style={{ color: "#fff", marginTop: 60, fontSize: 15 }}>Cargando PDF…</div>}
        {error && <div style={{ color: "#fca5a5", marginTop: 60, fontSize: 15 }}>{error}</div>}
        {!loading && !error && Array.from({ length: numPages }).map((_, i) => (
          <canvas
            key={i}
            ref={(el) => { if (el) canvasRefs.current[i] = el; }}
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.4)", background: "#fff", display: "block", maxWidth: "100%" }}
          />
        ))}
      </div>
    </div>
  );
}
const btnStyle: React.CSSProperties = {
  width: 32, height: 32, border: "1px solid #d1d5db", borderRadius: 6,
  background: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700,
  display: "flex", alignItems: "center", justifyContent: "center",
};

// ── Datos organigrama ────────────────────────────────────────────
const datosOrganigrama: OrgNodo = {
  nombre: "2.- MOBILIARIO NO CLINICO", tipo: "carpeta", nivel: 0, padre: null,
  url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO",
  hijos: [
    { nombre: "2.1 BASES", tipo: "carpeta", nivel: 1, padre: "2.- MOBILIARIO NO CLINICO",
      url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO%2F2%2E1%20BASES",
      hijos: [
        { nombre: "2.1.1 BASES LICITACION MOBILIARIO NO CLINICO", tipo: "carpeta", nivel: 2, padre: "2.1 BASES",
          url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO%2F2%2E1%20BASES%2F2%2E1%2E1%20BASES%20LICITACION%20MOBILIARIO%20NO%20CLINICO",
          hijos: [
            { nombre: "2.1.1.1 Anexos", tipo: "carpeta", nivel: 3, padre: "2.1.1 BASES LICITACION MOBILIARIO NO CLINICO",
              url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO%2F2%2E1%20BASES%2F2%2E1%2E1%20BASES%20LICITACION%20MOBILIARIO%20NO%20CLINICO%2F2%2E1%2E1%2E1%20Anexos",
              hijos: [
                { nombre: "A", tipo: "carpeta", nivel: 4, padre: "2.1.1.1 Anexos", url: "#",
                  hijos: [{ nombre: "Anexo N°1 AP.docx", tipo: "archivo", extension: "docx", nivel: 5, padre: "A", url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Operaciones/CHI%20HBP/03%20ADQ-REP/2.-%20MOBILIARIO%20NO%20CLINICO/2.1%20BASES/2.1.1%20BASES%20LICITACION%20MOBILIARIO%20NO%20CLINICO/2.1.1.1%20Anexos/A/Anexo%20N%C2%B01%20AP.docx" }] },
                { nombre: "B", tipo: "carpeta", nivel: 4, padre: "2.1.1.1 Anexos", url: "#",
                  hijos: [
                    { nombre: "Anexo N°8 EETT", tipo: "carpeta", nivel: 5, padre: "B", url: "#", hijos: [] },
                    { nombre: "Anexo N°3 CRONO.docx", tipo: "archivo", extension: "docx", nivel: 5, padre: "B", url: "#" }
                  ] }
              ] },
            { nombre: "2.1.1.2 Documentos", tipo: "carpeta", nivel: 3, padre: "2.1.1 BASES LICITACION MOBILIARIO NO CLINICO",
              url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO%2F2%2E1%20BASES%2F2%2E1%2E1%20BASES%20LICITACION%20MOBILIARIO%20NO%20CLINICO%2F2%2E1%2E1%2E2%20Documentos",
              hijos: [
                { nombre: "6. Planos", tipo: "carpeta", nivel: 4, padre: "2.1.1.2 Documentos", url: "#",
                  hijos: [
                    { nombre: "DWG", tipo: "carpeta", nivel: 5, padre: "6. Planos", url: "#",
                      hijos: [
                        { nombre: "HBP-MOB-EQU-R2021-bbats01-8503181.jpg", tipo: "archivo", extension: "jpg", nivel: 6, padre: "DWG", url: "#" },
                        { nombre: "HBP-MOB-EQU-R2021-bbats01-8504958.jpg", tipo: "archivo", extension: "jpg", nivel: 6, padre: "DWG", url: "#" }
                      ] },
                    { nombre: "PDF", tipo: "carpeta", nivel: 5, padre: "6. Planos", url: "#",
                      hijos: [
                        { nombre: "HBP-PISO 1-1001RevD.pdf", tipo: "archivo", extension: "pdf", nivel: 6, padre: "PDF", url: "#" },
                        { nombre: "HBP-PISO 2-1002RevD.pdf", tipo: "archivo", extension: "pdf", nivel: 6, padre: "PDF", url: "#" }
                      ] }
                  ] },
                { nombre: "7. Formulario para la presentación de Consultas", tipo: "carpeta", nivel: 4, padre: "2.1.1.2 Documentos", url: "#",
                  hijos: [{ nombre: "7. Formulario para presentación de Consultas.xlsx", tipo: "archivo", extension: "xlsx", nivel: 5, padre: "7. Formulario para la presentación de Consultas", url: "#" }] },
                { nombre: "4. Detalle listado Tipos Equipo Mobiliario-Elite600SFF.xlsx", tipo: "archivo", extension: "xlsx", nivel: 4, padre: "2.1.1.2 Documentos", url: "#" },
                { nombre: "5. Detalle Entrenamiento por Tipo Equipo Mobiliario.xlsx", tipo: "archivo", extension: "xlsx", nivel: 4, padre: "2.1.1.2 Documentos", url: "#" }
              ] }
          ] },
        { nombre: "2.1.2 BACO V4_MNC - CON MANTENIMIENTO", tipo: "carpeta", nivel: 2, padre: "2.1 BASES",
          url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO%2F2%2E1%20BASES%2F2%2E1%2E2%20BACO%20V4%5FMNC%20%2D%20CON%20MANTENIMIENTO",
          hijos: [
            { nombre: "2.1.2.1 Anexos", tipo: "carpeta", nivel: 3, padre: "2.1.2 BACO V4_MNC - CON MANTENIMIENTO", url: "#",
              hijos: [
                { nombre: "A", tipo: "carpeta", nivel: 4, padre: "2.1.2.1 Anexos", url: "#",
                  hijos: [{ nombre: "Anexo N°1 AP.docx", tipo: "archivo", extension: "docx", nivel: 5, padre: "A", url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Operaciones/CHI%20HBP/03%20ADQ-REP/2.-%20MOBILIARIO%20NO%20CLINICO/2.1%20BASES/2.1.2%20BACO%20V4_MNC%20-%20CON%20MANTENIMIENTO/2.1.2.1%20Anexos/A/Anexo%20N%C2%B01%20AP.docx" }] },
                { nombre: "B", tipo: "carpeta", nivel: 4, padre: "2.1.2.1 Anexos", url: "#",
                  hijos: [
                    { nombre: "Anexo N°8 EETT", tipo: "carpeta", nivel: 5, padre: "B", url: "#",
                      hijos: [
                        { nombre: "EETT_ADAPTADOR DE LLAVES.xlsx", tipo: "archivo", extension: "xlsx", nivel: 6, padre: "Anexo N°8 EETT", url: "#" },
                        { nombre: "EETT_ATRIL GRADUABLE.xlsx", tipo: "archivo", extension: "xlsx", nivel: 6, padre: "Anexo N°8 EETT", url: "#" }
                      ] },
                    { nombre: "Anexo N°2 PNI.xls", tipo: "archivo", extension: "xls", nivel: 5, padre: "B", url: "#" }
                  ] }
              ] },
            { nombre: "2.1.2.2 Documentos", tipo: "carpeta", nivel: 3, padre: "2.1.2 BACO V4_MNC - CON MANTENIMIENTO", url: "#",
              hijos: [
                { nombre: "6. Planos", tipo: "carpeta", nivel: 4, padre: "2.1.2.2 Documentos", url: "#",
                  hijos: [
                    { nombre: "DWG", tipo: "carpeta", nivel: 5, padre: "6. Planos", url: "#",
                      hijos: [
                        { nombre: "HBP-MOB-EQU-R2021-bbats01-8503181.jpg", tipo: "archivo", extension: "jpg", nivel: 6, padre: "DWG", url: "#" },
                        { nombre: "HBP-MOB-EQU-R2021-bbats01-8504958.jpg", tipo: "archivo", extension: "jpg", nivel: 6, padre: "DWG", url: "#" }
                      ] },
                    { nombre: "PDF", tipo: "carpeta", nivel: 5, padre: "6. Planos", url: "#",
                      hijos: [
                        { nombre: "HBP-PISO 1-1001RevD.pdf", tipo: "archivo", extension: "pdf", nivel: 6, padre: "PDF", url: "#" },
                        { nombre: "HBP-PISO 2-1002RevD.pdf", tipo: "archivo", extension: "pdf", nivel: 6, padre: "PDF", url: "#" }
                      ] }
                  ] },
                { nombre: "7. Formulario para la presentación de Consultas", tipo: "carpeta", nivel: 4, padre: "2.1.2.2 Documentos", url: "#",
                  hijos: [{ nombre: "7. Formulario para presentación de Consultas.xlsx", tipo: "archivo", extension: "xlsx", nivel: 5, padre: "7. Formulario para la presentación de Consultas", url: "#" }] },
                { nombre: "4. Detalle listado Tipos Equipo Mobiliario-Elite600SFF.xlsx", tipo: "archivo", extension: "xlsx", nivel: 4, padre: "2.1.2.2 Documentos", url: "#" },
                { nombre: "5. Detalle Entrenamiento por Tipo Equipo Mobiliario.xlsx", tipo: "archivo", extension: "xlsx", nivel: 4, padre: "2.1.2.2 Documentos", url: "#" }
              ] }
          ] }
      ] },
    { nombre: "2.2 DOCUMENTOS", tipo: "carpeta", nivel: 1, padre: "2.- MOBILIARIO NO CLINICO",
      url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO%2F2%2E2%20DOCUMENTOS",
      hijos: [
        { nombre: "2.2.1 CARTAS Y FOLIOS MNC", tipo: "carpeta", nivel: 2, padre: "2.2 DOCUMENTOS", url: "#",
          hijos: [
            { nombre: "2.2.1.1 CARTAS A SC", tipo: "carpeta", nivel: 3, padre: "2.2.1 CARTAS Y FOLIOS MNC", url: "#",
              hijos: [
                { nombre: "GD-SC N°24-335 Respuesta Folio 030 MnC", tipo: "archivo", extension: "pdf", nivel: 4, padre: "2.2.1.1 CARTAS A SC", url: "#" },
                { nombre: "GT-SC N°24-033 Informe análisis comparativo entre anexo", tipo: "archivo", extension: "pdf", nivel: 4, padre: "2.2.1.1 CARTAS A SC", url: "#" }
              ] },
            { nombre: "2.2.1.2 CARTAS SC-DOMIN", tipo: "carpeta", nivel: 3, padre: "2.2.1 CARTAS Y FOLIOS MNC", url: "#",
              hijos: [{ nombre: "Fwd_SCHBP-DOM-432-2024_Informe análisis comparativo", tipo: "archivo", extension: "pdf", nivel: 4, padre: "2.2.1.2 CARTAS SC-DOMIN", url: "#" }] }
          ] },
        { nombre: "2.2.2 CORRESPONDENCIA", tipo: "carpeta", nivel: 2, padre: "2.2 DOCUMENTOS", url: "#",
          hijos: [{ nombre: "Historial de Cartas_Integrador.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.2.2 CORRESPONDENCIA", url: "#" }] }
      ] },
    { nombre: "2.3 OFERTAS", tipo: "carpeta", nivel: 1, padre: "2.- MOBILIARIO NO CLINICO",
      url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO%2F2%2E3%20OFERTAS",
      hijos: [
        { nombre: "2.3.1 ACLARATORIAS MNC", tipo: "carpeta", nivel: 2, padre: "2.3 OFERTAS",
          url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO%2F2%2E3%20OFERTAS%2F2%2E3%2E1%20ACLARATORIAS%20MNC",
          hijos: [
            { nombre: "ALLMEDICA", tipo: "carpeta", nivel: 3, padre: "2.3.1 ACLARATORIAS MNC", url: "#", hijos: [] },
            { nombre: "COMERCIAL HAGELIN", tipo: "carpeta", nivel: 3, padre: "2.3.1 ACLARATORIAS MNC", url: "#", hijos: [] },
            { nombre: "EASTON", tipo: "carpeta", nivel: 3, padre: "2.3.1 ACLARATORIAS MNC", url: "#", hijos: [] },
            { nombre: "MELMAN", tipo: "carpeta", nivel: 3, padre: "2.3.1 ACLARATORIAS MNC", url: "#", hijos: [] }
          ] },
        { nombre: "2.3.2 CONSULTA PROVEEDORES", tipo: "carpeta", nivel: 2, padre: "2.3 OFERTAS",
          url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO%2F2%2E3%20OFERTAS%2F2%2E3%2E2%20CONSULTA%20PROVEEDORES",
          hijos: [
            { nombre: "Consultas 12-08 - INTERGROUPE S.A..xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.2 CONSULTA PROVEEDORES", url: "#" },
            { nombre: "Consultas 12-08 - Muebles Sur Spa.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.2 CONSULTA PROVEEDORES", url: "#" },
            { nombre: "Consultas 19-08 - AMUV.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.2 CONSULTA PROVEEDORES", url: "#" },
            { nombre: "Consultas 19-08 - EASTON.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.2 CONSULTA PROVEEDORES", url: "#" },
            { nombre: "Listado de Proveedores MNC.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.2 CONSULTA PROVEEDORES", url: "#" }
          ] },
        { nombre: "2.3.3 OFERTAS PROVEEDORES", tipo: "carpeta", nivel: 2, padre: "2.3 OFERTAS",
          url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO%2F2%2E3%20OFERTAS%2F2%2E3%2E3%20OFERTAS%20PROVEEDORES",
          hijos: [
            { nombre: "ALLMEDICA", tipo: "carpeta", nivel: 3, padre: "2.3.3 OFERTAS PROVEEDORES", url: "#",
              hijos: [
                { nombre: "CARPETA A-ALLMEDICA", tipo: "carpeta", nivel: 4, padre: "ALLMEDICA", url: "#",
                  hijos: [
                    { nombre: "ANEXO N°1 AP-ALLMEDICA", tipo: "carpeta", nivel: 5, padre: "CARPETA A-ALLMEDICA", url: "#", hijos: [] },
                    { nombre: "Certificado de Vigencia de Poder- ALLMEDICA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA A-ALLMEDICA", url: "#" },
                    { nombre: "Certificado de Vigencia de Sociedad- ALLMEDICA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA A-ALLMEDICA", url: "#" },
                    { nombre: "Certificado de garantia-ALLMEDICA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA A-ALLMEDICA", url: "#" }
                  ] },
                { nombre: "CARPETA B-ALLMEDICA", tipo: "carpeta", nivel: 4, padre: "ALLMEDICA", url: "#", hijos: [] },
                { nombre: "CARPETA C-ALLMEDICA", tipo: "carpeta", nivel: 4, padre: "ALLMEDICA", url: "#",
                  hijos: [
                    { nombre: "Anexo N°10 DDO-ALLMEDICA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA C-ALLMEDICA", url: "#" },
                    { nombre: "Anexo N°11 CEETT-ALLMEDICA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA C-ALLMEDICA", url: "#" },
                    { nombre: "Anexo N°12 CGT-ALLMEDICA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA C-ALLMEDICA", url: "#" },
                    { nombre: "Anexo N°9 DJO-ALLMEDICA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA C-ALLMEDICA", url: "#" }
                  ] },
                { nombre: "CERTIFICADOS", tipo: "carpeta", nivel: 4, padre: "ALLMEDICA", url: "#", hijos: [] },
                { nombre: "FICHAS TECNICAS", tipo: "carpeta", nivel: 4, padre: "ALLMEDICA", url: "#",
                  hijos: [
                    { nombre: "201.003 MESA PARVULO INCLUSION", tipo: "carpeta", nivel: 5, padre: "FICHAS TECNICAS", url: "#", hijos: [] },
                    { nombre: "201.004 MESA PARVULO TIPO I", tipo: "carpeta", nivel: 5, padre: "FICHAS TECNICAS", url: "#", hijos: [] },
                    { nombre: "201.005 MESA PARVULO TIPO II", tipo: "carpeta", nivel: 5, padre: "FICHAS TECNICAS", url: "#", hijos: [] },
                    { nombre: "202.010 ESCALERA TIJERA 4 PELD", tipo: "carpeta", nivel: 5, padre: "FICHAS TECNICAS", url: "#", hijos: [] },
                    { nombre: "203.006 CARRO TRANSPORTE PALLET", tipo: "carpeta", nivel: 5, padre: "FICHAS TECNICAS", url: "#", hijos: [] },
                    { nombre: "203.007 CARRO DUAL", tipo: "carpeta", nivel: 5, padre: "FICHAS TECNICAS", url: "#", hijos: [] },
                    { nombre: "203.008 CARRO METALICO", tipo: "carpeta", nivel: 5, padre: "FICHAS TECNICAS", url: "#", hijos: [] },
                    { nombre: "203.009 CARRO PLATAFORMA DE CARGA", tipo: "carpeta", nivel: 5, padre: "FICHAS TECNICAS", url: "#", hijos: [] },
                    { nombre: "203.010 COLCHONETAS", tipo: "carpeta", nivel: 5, padre: "FICHAS TECNICAS", url: "#", hijos: [] },
                    { nombre: "203.012 JUEGO TACA TACA", tipo: "carpeta", nivel: 5, padre: "FICHAS TECNICAS", url: "#", hijos: [] },
                    { nombre: "203.013 JUEGO TENIS DE MESA", tipo: "carpeta", nivel: 5, padre: "FICHAS TECNICAS", url: "#", hijos: [] },
                    { nombre: "203.019 PIZARRA ACRILICA", tipo: "carpeta", nivel: 5, padre: "FICHAS TECNICAS", url: "#", hijos: [] },
                    { nombre: "204.005 SILLA BACINICA", tipo: "carpeta", nivel: 5, padre: "FICHAS TECNICAS", url: "#", hijos: [] },
                    { nombre: "204.007 SILLA LACTANTE", tipo: "carpeta", nivel: 5, padre: "FICHAS TECNICAS", url: "#", hijos: [] },
                    { nombre: "204.008 SILLA NIDO", tipo: "carpeta", nivel: 5, padre: "FICHAS TECNICAS", url: "#", hijos: [] },
                    { nombre: "204.009 SILLA PARVULOS", tipo: "carpeta", nivel: 5, padre: "FICHAS TECNICAS", url: "#", hijos: [] }
                  ] }
              ] },
            { nombre: "Comercial Hagelin SpA", tipo: "carpeta", nivel: 3, padre: "2.3.3 OFERTAS PROVEEDORES", url: "#",
              hijos: [
                { nombre: "Carpeta A_Comercial Hagelin SpA", tipo: "carpeta", nivel: 4, padre: "Comercial Hagelin SpA", url: "#",
                  hijos: [
                    { nombre: "Anexo N°1 AP_Comercial Hagelin.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta A_Comercial Hagelin SpA", url: "#" },
                    { nombre: "Certificado de Vigencia_Rep Legal_Comercial Hagelin.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta A_Comercial Hagelin SpA", url: "#" },
                    { nombre: "Certificado de Vigencia_Sociedad_Comercial Hagelin.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta A_Comercial Hagelin SpA", url: "#" },
                    { nombre: "Garantia Seriedad Oferta_Comercial Hagelin.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta A_Comercial Hagelin SpA", url: "#" }
                  ] },
                { nombre: "Carpeta B_Comercial Hagelin SpA", tipo: "carpeta", nivel: 4, padre: "Comercial Hagelin SpA", url: "#",
                  hijos: [
                    { nombre: "Anexo Nº8 EETT_Comercial Hagelin", tipo: "carpeta", nivel: 5, padre: "Carpeta B_Comercial Hagelin SpA", url: "#", hijos: [] },
                    { nombre: "Anexo N°3 CRONO_Comercial Hagelin.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta B_Comercial Hagelin SpA", url: "#" },
                    { nombre: "Anexo N°4 PINS_Comercial Hagelin.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta B_Comercial Hagelin SpA", url: "#" },
                    { nombre: "Anexo N°5 MANR_Comercial Hagelin.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta B_Comercial Hagelin SpA", url: "#" },
                    { nombre: "Anexo N°6 ENT_Comercial Hagelin.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta B_Comercial Hagelin SpA", url: "#" },
                    { nombre: "Anexo N°7 ST_Comercial Hagelin.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta B_Comercial Hagelin SpA", url: "#" },
                    { nombre: "Anexo Nº2 PNI (Rev.2)_Comercial Hagelin.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta B_Comercial Hagelin SpA", url: "#" },
                    { nombre: "Anexo Nº2 PNI (Rev.2)_Comercial Hagelin.xls", tipo: "archivo", extension: "xls", nivel: 5, padre: "Carpeta B_Comercial Hagelin SpA", url: "#" }
                  ] },
                { nombre: "Carpeta C_Comercial Hagelin SpA", tipo: "carpeta", nivel: 4, padre: "Comercial Hagelin SpA", url: "#",
                  hijos: [
                    { nombre: "Anexo N°10 DDO_Comercial Hagelin.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta C_Comercial Hagelin SpA", url: "#" },
                    { nombre: "Anexo N°11 CEETT_Comercial Hagelin.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta C_Comercial Hagelin SpA", url: "#" },
                    { nombre: "Anexo N°12 CGT_Comercial Hagelin.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta C_Comercial Hagelin SpA", url: "#" },
                    { nombre: "Anexo N°9 DJO_Comercial Hagelin.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta C_Comercial Hagelin SpA", url: "#" }
                  ] }
              ] },
            { nombre: "Documentacion", tipo: "carpeta", nivel: 3, padre: "2.3.3 OFERTAS PROVEEDORES", url: "#",
              hijos: [
                { nombre: "3 Cotizaciones", tipo: "carpeta", nivel: 4, padre: "Documentacion", url: "#", hijos: [] },
                { nombre: "Ia Actualizado", tipo: "carpeta", nivel: 4, padre: "Documentacion", url: "#",
                  hijos: [
                    { nombre: "ANEXO IA HSLBP 02-04-2020_Aclaratoria_MOBILIARIO POR OBRA  VERSION FINAL SSMS 02.12.2024.xls", tipo: "archivo", extension: "xls", nivel: 5, padre: "Ia Actualizado", url: "#" },
                    { nombre: "ANEXO IA HSLBP 02-04-2020_Aclaratoria_MOBILIARIO POR OBRA  VERSION FINAL SSMS 02.xls", tipo: "archivo", extension: "xls", nivel: 5, padre: "Ia Actualizado", url: "#" }
                  ] },
                { nombre: "PAO", tipo: "carpeta", nivel: 4, padre: "Documentacion", url: "#",
                  hijos: [
                    { nombre: "PAO Adquisicion Hospital Buin Paine.docx", tipo: "archivo", extension: "docx", nivel: 5, padre: "PAO", url: "#" },
                    { nombre: "PAO HBP Servicio Adm y Man EMMC.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "PAO", url: "#" },
                    { nombre: "PAO.docx", tipo: "archivo", extension: "docx", nivel: 5, padre: "PAO", url: "#" }
                  ] },
                { nombre: "Plan de Instalación", tipo: "carpeta", nivel: 4, padre: "Documentacion", url: "#", hijos: [] },
                { nombre: "Planos", tipo: "carpeta", nivel: 4, padre: "Documentacion", url: "#", hijos: [] }
              ] },
            { nombre: "Dunati Chile Spa", tipo: "carpeta", nivel: 3, padre: "2.3.3 OFERTAS PROVEEDORES", url: "#",
              hijos: [
                { nombre: "Anexo N°1 AP (1).pdf", tipo: "archivo", extension: "pdf", nivel: 4, padre: "Dunati Chile Spa", url: "#" },
                { nombre: "Anexo Nº2 PNI (Rev.2) (1).pdf", tipo: "archivo", extension: "pdf", nivel: 4, padre: "Dunati Chile Spa", url: "#" },
                { nombre: "COT-4921 _ MOBILIARIO - LIC HOSPITAL SAN LUIS DE BUIN - PAINE (2).pdf", tipo: "archivo", extension: "pdf", nivel: 4, padre: "Dunati Chile Spa", url: "#" },
                { nombre: "EETT 201.001 ESTACION DE TRABAJO (REV1).pdf", tipo: "archivo", extension: "pdf", nivel: 4, padre: "Dunati Chile Spa", url: "#" },
                { nombre: "EETT 201.010 MESA REUNIONES TIPO III (REV2).pdf", tipo: "archivo", extension: "pdf", nivel: 4, padre: "Dunati Chile Spa", url: "#" },
                { nombre: "FT ACCESS_CAJONERA ES.pdf", tipo: "archivo", extension: "pdf", nivel: 4, padre: "Dunati Chile Spa", url: "#" },
                { nombre: "FT MESAS RUGBY_240120.pdf", tipo: "archivo", extension: "pdf", nivel: 4, padre: "Dunati Chile Spa", url: "#" },
                { nombre: "FT SERIE VERSA_2023.pdf", tipo: "archivo", extension: "pdf", nivel: 4, padre: "Dunati Chile Spa", url: "#" }
              ] },
            { nombre: "Easton", tipo: "carpeta", nivel: 3, padre: "2.3.3 OFERTAS PROVEEDORES", url: "#",
              hijos: [
                { nombre: "Carpeta A", tipo: "carpeta", nivel: 4, padre: "Easton", url: "#",
                  hijos: [
                    { nombre: "Anexo N°1 AP.docx", tipo: "archivo", extension: "docx", nivel: 5, padre: "Carpeta A", url: "#" },
                    { nombre: "Anexo N°1 AP.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta A", url: "#" },
                    { nombre: "CERTIFICADO DE VIGENCIA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta A", url: "#" }
                  ] },
                { nombre: "Carpeta B", tipo: "carpeta", nivel: 4, padre: "Easton", url: "#",
                  hijos: [
                    { nombre: "Anexo Nº8", tipo: "carpeta", nivel: 5, padre: "Carpeta B", url: "#", hijos: [] },
                    { nombre: "Anexo N°3 CRONO.docx", tipo: "archivo", extension: "docx", nivel: 5, padre: "Carpeta B", url: "#" },
                    { nombre: "Anexo N°3 CRONO.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta B", url: "#" },
                    { nombre: "Anexo N°4 PINS.docx", tipo: "archivo", extension: "docx", nivel: 5, padre: "Carpeta B", url: "#" },
                    { nombre: "Anexo N°4 PINS.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta B", url: "#" },
                    { nombre: "Anexo N°5 MANR.docx", tipo: "archivo", extension: "docx", nivel: 5, padre: "Carpeta B", url: "#" },
                    { nombre: "Anexo N°5 MANR.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta B", url: "#" },
                    { nombre: "Anexo N°6 ENT.docx", tipo: "archivo", extension: "docx", nivel: 5, padre: "Carpeta B", url: "#" },
                    { nombre: "Anexo N°6 ENT.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta B", url: "#" },
                    { nombre: "Anexo N°7 ST.docx", tipo: "archivo", extension: "docx", nivel: 5, padre: "Carpeta B", url: "#" },
                    { nombre: "Anexo N°7 ST.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta B", url: "#" },
                    { nombre: "Anexo Nº2 PNI (Rev.2).pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta B", url: "#" },
                    { nombre: "Anexo Nº2 PNI (Rev.2).xlsx", tipo: "archivo", extension: "xlsx", nivel: 5, padre: "Carpeta B", url: "#" }
                  ] },
                { nombre: "Carpeta C", tipo: "carpeta", nivel: 4, padre: "Easton", url: "#",
                  hijos: [
                    { nombre: "Anexo N°10 DDO.docx", tipo: "archivo", extension: "docx", nivel: 5, padre: "Carpeta C", url: "#" },
                    { nombre: "Anexo N°10 DDO.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta C", url: "#" },
                    { nombre: "Anexo N°11 CEETT.docx", tipo: "archivo", extension: "docx", nivel: 5, padre: "Carpeta C", url: "#" },
                    { nombre: "Anexo N°11 CEETT.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta C", url: "#" },
                    { nombre: "Anexo N°12 CGT.docx", tipo: "archivo", extension: "docx", nivel: 5, padre: "Carpeta C", url: "#" },
                    { nombre: "Anexo N°12 CGT.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta C", url: "#" },
                    { nombre: "Anexo N°9 DJO.docx", tipo: "archivo", extension: "docx", nivel: 5, padre: "Carpeta C", url: "#" },
                    { nombre: "Anexo N°9 DJO.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "Carpeta C", url: "#" }
                  ] }
              ] },
            { nombre: "Melman SPA", tipo: "carpeta", nivel: 3, padre: "2.3.3 OFERTAS PROVEEDORES", url: "#",
              hijos: [
                { nombre: "CARPETA A - Melman SPA", tipo: "carpeta", nivel: 4, padre: "Melman SPA", url: "#",
                  hijos: [
                    { nombre: "Anexo N°1 AP - Melman SPA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA A - Melman SPA", url: "#" },
                    { nombre: "Boleta de Garantia de Seriedad de la Oferta - Melman SPA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA A - Melman SPA", url: "#" },
                    { nombre: "Certificado de vigencia - Melman SPA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA A - Melman SPA", url: "#" },
                    { nombre: "Certificado de vigencia de poder - Melman SP.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA A - Melman SPA", url: "#" }
                  ] },
                { nombre: "CARPETA B - Melman SPA", tipo: "carpeta", nivel: 4, padre: "Melman SPA", url: "#",
                  hijos: [
                    { nombre: "Anexo Nº8 EETT", tipo: "carpeta", nivel: 5, padre: "CARPETA B - Melman SPA", url: "#", hijos: [] },
                    { nombre: "Anexo N°2 PNI - Melman SPA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA B - Melman SPA", url: "#" },
                    { nombre: "Anexo N°3 CRONO - Melman SPA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA B - Melman SPA", url: "#" },
                    { nombre: "Anexo N°4 PINS - Melman SPA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA B - Melman SPA", url: "#" },
                    { nombre: "Anexo N°5 MANR - Melman SPA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA B - Melman SPA", url: "#" },
                    { nombre: "Anexo N°6 ENT - Melman SPA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA B - Melman SPA", url: "#" },
                    { nombre: "Anexo N°7 ST - Melman SPA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA B - Melman SPA", url: "#" },
                    { nombre: "Anexo Nº2 PNI - Melman SPA.xls", tipo: "archivo", extension: "xls", nivel: 5, padre: "CARPETA B - Melman SPA", url: "#" }
                  ] },
                { nombre: "CARPETA C - Melman SPA", tipo: "carpeta", nivel: 4, padre: "Melman SPA", url: "#",
                  hijos: [
                    { nombre: "Anexo N°10 DDO - Melman SPA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA C - Melman SPA", url: "#" },
                    { nombre: "Anexo N°11 CEETT - Melman SPA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA C - Melman SPA", url: "#" },
                    { nombre: "Anexo N°12 CGT - Melman SPA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA C - Melman SPA", url: "#" },
                    { nombre: "Anexo N°9 DJO - Melman SPA.pdf", tipo: "archivo", extension: "pdf", nivel: 5, padre: "CARPETA C - Melman SPA", url: "#" }
                  ] }
              ] }
          ] },
        { nombre: "2.3.4 REGISTRO PROVEEDORES", tipo: "carpeta", nivel: 2, padre: "2.3 OFERTAS",
          url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO%2F2%2E3%20OFERTAS%2F2%2E3%2E4%20REGISTRO%20PROVEEDORES",
          hijos: [
            { nombre: "Registro de Participantes MNC - DIB CHILE.pdf", tipo: "archivo", extension: "pdf", nivel: 3, padre: "2.3.4 REGISTRO PROVEEDORES", url: "#" },
            { nombre: "Registro de Participantes MNC - SISKATEK.pdf", tipo: "archivo", extension: "pdf", nivel: 3, padre: "2.3.4 REGISTRO PROVEEDORES", url: "#" },
            { nombre: "Registro de participantes MNC - ALLMEDICA.pdf", tipo: "archivo", extension: "pdf", nivel: 3, padre: "2.3.4 REGISTRO PROVEEDORES", url: "#" },
            { nombre: "Registro de participantes MNC - AMUV.pdf", tipo: "archivo", extension: "pdf", nivel: 3, padre: "2.3.4 REGISTRO PROVEEDORES", url: "#" },
            { nombre: "Registro de participantes MNC - ARQUIMED.pdf", tipo: "archivo", extension: "pdf", nivel: 3, padre: "2.3.4 REGISTRO PROVEEDORES", url: "#" },
            { nombre: "Registro de participantes MNC - CERANTOLA.PDF", tipo: "archivo", extension: "pdf", nivel: 3, padre: "2.3.4 REGISTRO PROVEEDORES", url: "#" },
            { nombre: "Registro de participantes MNC - DUNATI.pdf", tipo: "archivo", extension: "pdf", nivel: 3, padre: "2.3.4 REGISTRO PROVEEDORES", url: "#" },
            { nombre: "Registro de participantes MNC - EASTON DESING.pdf", tipo: "archivo", extension: "pdf", nivel: 3, padre: "2.3.4 REGISTRO PROVEEDORES", url: "#" },
            { nombre: "Registro de participantes MNC - INTERGROUPE S.A..pdf", tipo: "archivo", extension: "pdf", nivel: 3, padre: "2.3.4 REGISTRO PROVEEDORES", url: "#" },
            { nombre: "Registro de participantes MNC - MELMAN.PDF", tipo: "archivo", extension: "pdf", nivel: 3, padre: "2.3.4 REGISTRO PROVEEDORES", url: "#" },
            { nombre: "Registro de participantes MNC - MUEBLES SUR SPA.pdf", tipo: "archivo", extension: "pdf", nivel: 3, padre: "2.3.4 REGISTRO PROVEEDORES", url: "#" },
            { nombre: "Registro de participantes MNC - POLARIS.pdf", tipo: "archivo", extension: "pdf", nivel: 3, padre: "2.3.4 REGISTRO PROVEEDORES", url: "#" },
            { nombre: "Registro de participantes MNC - TECNIGEN.pdf", tipo: "archivo", extension: "pdf", nivel: 3, padre: "2.3.4 REGISTRO PROVEEDORES", url: "#" }
          ] },
        { nombre: "2.3.5 RESPUESTAS A PROVEEDORES", tipo: "carpeta", nivel: 2, padre: "2.3 OFERTAS",
          url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO%2F2%2E3%20OFERTAS%2F2%2E3%2E5%20RESPUESTAS%20A%20PROVEEDORES",
          hijos: [
            { nombre: "Consultas MNC 19-08-Elite600SFF.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.5 RESPUESTAS A PROVEEDORES", url: "#" },
            { nombre: "Consultas MNC 19-08.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.5 RESPUESTAS A PROVEEDORES", url: "#" },
            { nombre: "Consultas MNC-Elite600SFF.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.5 RESPUESTAS A PROVEEDORES", url: "#" },
            { nombre: "Consultas MNC.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.5 RESPUESTAS A PROVEEDORES", url: "#" }
          ] },
        { nombre: "2.3.6 RESPUESTAS ACLARATORIAS", tipo: "carpeta", nivel: 2, padre: "2.3 OFERTAS",
          url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO%2F2%2E3%20OFERTAS%2F2%2E3%2E6%20RESPUESTAS%20ACLARATORIAS",
          hijos: [
            { nombre: "CONSOLIDADO ACLARATORIAS MNC FINAL.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.6 RESPUESTAS ACLARATORIAS", url: "#" },
            { nombre: "CONSOLIDADO ACLARATORIAS MNC.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.6 RESPUESTAS ACLARATORIAS", url: "#" }
          ] },
        { nombre: "2.3.7 REVISION", tipo: "carpeta", nivel: 2, padre: "2.3 OFERTAS",
          url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO%2F2%2E3%20OFERTAS%2F2%2E3%2E7%20REVISION",
          hijos: [
            { nombre: "201.001 Estacion de Trabajo", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "201.002 Mesa Lateral", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "201.003 Mesa Parvulo Inclusion", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "201.004 Mesa Parvulo Tipo I", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "201.005 Mesa Parvulo Tipo II", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "201.006 Mesa Plegable", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "201.007 Mesa Reuniones Pleglable", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "201.008 Mesa Reuniones Tipo I", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "201.009 (Mesa Reuniones Tipo II)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "201.010 (Mesa Reuniones Tipo III)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "201.011 (Mesa Tipo Casino)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "201.012 (Mesa Trabajo Individual)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "201.013 (Altar Ecumenico)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "202.001 (Atril Graduable)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "202.002 (Caja Fuerte Tipo I) desierto", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "202.003 (Caja Fuerte Tipo II) desierto", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "202.004 (Cama 1.5 Plaza) desierto", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "202.005 (Cama 1 Plaza) desierto", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "202.006 (Cama Apilable)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "202.007 (Carro de Carga) desierto", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "202.008 (Cuna Alta)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "202.009 (Cuna Baja)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "202.010 (Escalera Tijera)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "202.012 (Mueble Locker)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "202.013 (Pallet) desierto", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "202.014 (Podium)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.001 (Adaptador de LLaves) desierto", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.002 (Carro Bandejero) desierto", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.003 (Carro de Transporte) desierto", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.004 (Carro de Transporte Alto) desierto", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.005 (Carro de Transporte Cajas Plásticas) desierto", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.006 (Carro de Transporte Pallet)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.007 (Carro Dual dos Ruedas)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.008 (Carro Metálico)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.009 (Carro Plataforma de Carga)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.010  (Colchoneta Reposo)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.011 (Estación de órtesis metálica) desierto", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.012 (Juego Taca-Taca)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.013 (Juego Tenis de Mesa)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.014 (Librero)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.015 (Mueble Arrimo)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.016 (Mueble Tipo Biblioteca)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.018 Perchero", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.019 (Pizarra Acrílicra)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.020 (Soporte de rollo Doble) desierto", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.021 (Velador)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "203.022 (Contenedor)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.001 (Banca (Sala Cuna)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.002 (Banca Madera)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.003 (Silla Adulta)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.004 (Silla Apilable de Base Ancha)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.005 (Silla Bacinica)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.006 (Silla Ergonómica)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.007 (Silla Lactante)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.008 (Silla Nido)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.009 (Silla Párvulo)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.010 (Silla Tipo Casino)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.011 (Silla Tipo Universitaria)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.012 (Silla Visita)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.013 (Silla 1 Cuerpo)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.014 (Silla 2 Cuerpo)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.015 (Sillón Bergere)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.016 (Sillón Tipo Poltrona)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.017 (Tarima)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.018 (Silla Alta Cafeteria)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.019 (Silla de apoyo hora de ingesta)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.020 (Silla butaca 3 cuerpo)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] },
            { nombre: "204.021 (Banca Ecumenica)", tipo: "carpeta", nivel: 3, padre: "2.3.7 REVISION", url: "#", hijos: [] }
          ] },
        { nombre: "2.3.8 REGISTRO", tipo: "carpeta", nivel: 2, padre: "2.3 OFERTAS",
          url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO%2F2%2E3%20OFERTAS%2F2%2E3%2E8%20REGISTRO",
          hijos: [
            { nombre: "BD y evaluación de ofertas MNC.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.8 REGISTRO", url: "#" },
            { nombre: "Check List Antecedentes Grupo Licitaciones Mobiliario No Clínico.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.8 REGISTRO", url: "#" },
            { nombre: "GD-SC Nº24-379 Propuesta de Compra licitacion MNC.docx", tipo: "archivo", extension: "docx", nivel: 3, padre: "2.3.8 REGISTRO", url: "#" },
            { nombre: "Listado de Evaluación Económica Equipos MNC.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.8 REGISTRO", url: "#" },
            { nombre: "REGISTRO PARTICIPANTES CONCURSO MOBILIARIO NO CLÍNICO.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.8 REGISTRO", url: "#" },
            { nombre: "REGISTRO PROVEEDORES MNC-Elite600SFF.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.8 REGISTRO", url: "#" },
            { nombre: "REGISTRO PROVEEDORES MNC.xlsx", tipo: "archivo", extension: "xlsx", nivel: 3, padre: "2.3.8 REGISTRO", url: "#" }
          ] }
      ] },
    { nombre: "2.4 PROPUESTA DE COMPRA", tipo: "carpeta", nivel: 1, padre: "2.- MOBILIARIO NO CLINICO",
      url: "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=%2Fcolaborativos%2Fdesarrollonegocios%2FDocumentos%20compartidos%2FOperaciones%2FCHI%20HBP%2F03%20ADQ%2DREP%2F2%2E%2D%20MOBILIARIO%20NO%20CLINICO%2F2%2E4%20PROPUESTA%20DE%20COMPRA",
      hijos: [
        { nombre: "201.001 Estacion de Trabajo", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.001A (Escritorio Simple 120x70 cm)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.001B (Escritorio en L administrativo)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.001C (Escritorio de Consultas)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.001D (Escritorio simple 130x70 cm)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.002 (Mesa Lateral)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.002 Mesa Lateral", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.003 (Mesa Párvulo Inclusión)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.003 Mesa Parvulo Inclusion", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.004 (Mesa Párvulo Tipo I)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.004 Mesa Parvulo Tipo I", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.005 (Mesa Párvulo Tipo II)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.005 Mesa Parvulo Tipo II", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.006 (Mesa Pleglable)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.006 Mesa Plegable", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.007 (Mesa Reuniones Plegable)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.007 Mesa Reuniones Pleglable", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.008 (Mesa Reuniones Tipo I)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.008 Mesa Reuniones Tipo I", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.009 (Mesa Reuniones Tipo II)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.010 (Mesa Reuniones Tipo III)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.011 (Mesa Tipo Casino)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.012 (Mesa Trabajo Individual)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "201.013 (Altar Ecumenico)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.001 (Atril Graduable)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.002 (Caja Fuerte Tipo I)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.002 (Caja Fuerte Tipo I) desierto", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.003 (Caja Fuerte Tipo II)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.003 (Caja Fuerte Tipo II) desierto", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.004 (Cama 1.5 Plaza)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.004 (Cama 1.5 Plaza) desierto", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.005 (Cama 1 Plaza)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.005 (Cama 1 Plaza) desierto", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.006 (Cama Apilable)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.007 (Carro de Carga)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.007 (Carro de Carga) desierto", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.008 (Cuna Alta)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.009 (Cuna Baja)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.010 (Escalera Tijera)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.012 (Mueble Locker)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.013 (Pallet)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.013 (Pallet) desierto", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "202.014 (Podium)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.001 (Adaptador de LLaves)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.001 (Adaptador de LLaves) desierto", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.002 (Carro Bandejero)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.002 (Carro Bandejero) desierto", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.003 (Carro de Transporte)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.003 (Carro de Transporte) desierto", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.004 (Carro de Transporte Alto)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.004 (Carro de Transporte Alto) desierto", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.005 (Carro de Transporte Cajas Plásticas)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.005 (Carro de Transporte Cajas Plásticas) desierto", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.006 (Carro de Transporte Pallet)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.006 (Carrp de Transporte Pallet)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.007 (Carro Dual dos Ruedas)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.008 (Carro Metálico)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.009 (Carro Plataforma de Carga)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.010  (Colchoneta Reposo)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.010 A (Colchoneta Reposo_A)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.010 B (Colchoneta Reposo_B)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.011 (Estación de órtesis metálica)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.011 (Estación de órtesis metálica) desierto", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.012 (Juego Taca-Taca)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.013 (Juego Tenis de Mesa)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.014 (Librero)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.015 (Mueble Arrimo)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.016 (Mueble Tipo Biblioteca)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.016 A (Mueble Tipo Biblioteca M45_A)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.016 B (Mueble Tipo Biblioteca M45_B)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.018 Perchero", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.019 (Pizarra Acrílicra)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.020 (Soporte de rollo Doble)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.020 (Soporte de rollo Doble) desierto", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.021 (Velador)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "203.022 (Contenedor)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.001 (Banca (Sala Cuna)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.002 (Banca Madera)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.002 A (Banca Madera_A)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.002 B (Banca Madera_B)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.002 C (Banca Madera_C)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.002 D (Banca Madera_D)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.003 (Silla Adulta)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.004 (Silla Apilable de Base Ancha)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.005 (Silla Bacinica)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.006 (Silla Ergonómica)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.007 (Silla Lactante)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.008 (Silla Nido)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.009 (Silla Párvulo)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.010 (Silla Tipo Casino)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.011 (Silla Tipo Universitaria)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.012 (Silla Visita)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.013 (Silla 1 Cuerpo)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.014 (Silla 2 Cuerpo)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.015 (Sillón Bergere)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.016 (Sillón Tipo Poltrona)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.017 (Tarima)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.018 (Silla Alta Cafeteria)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.019 (Silla de apoyo hora de ingesta)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.020 (Silla butaca 3 cuerpo)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] },
        { nombre: "204.021 (Banca Ecumenica)", tipo: "carpeta", nivel: 2, padre: "2.4 PROPUESTA DE COMPRA", url: "#", hijos: [] }
      ] }
  ]
};

interface OrgNodo {
  nombre: string;
  tipo: "carpeta" | "archivo";
  extension?: string;
  nivel: number;
  padre: string | null;
  url: string;
  hijos?: OrgNodo[];
}

function iconoArchivo(ext?: string) {
  const m: Record<string, string> = { pdf: "📕", docx: "📘", doc: "📘", xlsx: "📗", xls: "📗", pptx: "🎨", jpg: "🖼️", jpeg: "🖼️", png: "🖼️" };
  return m[ext?.toLowerCase() ?? ""] ?? "📄";
}

const SP_ALLITEMS = "https://dominionglobal.sharepoint.com/colaborativos/desarrollonegocios/Documentos%20compartidos/Forms/AllItems.aspx?id=";
const SP_BASE_PATH = "/colaborativos/desarrollonegocios/Documentos compartidos/Operaciones/CHI HBP/03 ADQ-REP/2.- MOBILIARIO NO CLINICO/";

function encodeSP(s: string): string {
  return encodeURIComponent(s)
    .replace(/\./g, '%2E').replace(/-/g, '%2D')
    .replace(/!/g, '%21').replace(/~/g, '%7E')
    .replace(/\*/g, '%2A').replace(/'/g, '%27')
    .replace(/\(/g, '%28').replace(/\)/g, '%29');
}

function buildSPUrl(segments: string[]): string {
  if (segments.length === 0) return '#';
  const fullPath = SP_BASE_PATH + segments.join("/");
  const encodedPath = fullPath.split("/").map(encodeSP).join("%2F");
  return SP_ALLITEMS + encodedPath;
}

function contarStats(n: OrgNodo): { carpetas: number; archivos: number } {
  let carpetas = n.tipo === "carpeta" ? 1 : 0;
  let archivos = n.tipo === "archivo" ? 1 : 0;
  (n.hijos ?? []).forEach(h => { const s = contarStats(h); carpetas += s.carpetas; archivos += s.archivos; });
  return { carpetas, archivos };
}

function OrgNodoRow({ nodo, busqueda, depth = 0, path = [] }: { nodo: OrgNodo; busqueda: string; depth?: number; path?: string[] }) {
  const [abierto, setAbierto] = useState(depth < 1);
  const tieneHijos = (nodo.hijos ?? []).length > 0;
  const coincide = nodo.nombre.toLowerCase().includes(busqueda.toLowerCase());
  if (busqueda && !coincide && !tieneHijos) return null;

  const currentPath: string[] = nodo.nivel === 0 ? [] : [...path, nodo.nombre];
  const effectiveUrl = (nodo.url && nodo.url !== "#")
    ? nodo.url
    : nodo.tipo === 'carpeta'
      ? buildSPUrl(currentPath)
      : buildSPUrl(currentPath.slice(0, -1));

  const resaltar = (texto: string) => {
    if (!busqueda) return texto;
    const idx = texto.toLowerCase().indexOf(busqueda.toLowerCase());
    if (idx === -1) return texto;
    return <>{texto.slice(0, idx)}<mark style={{ background: "#fde68a", borderRadius: 3, padding: "0 2px" }}>{texto.slice(idx, idx + busqueda.length)}</mark>{texto.slice(idx + busqueda.length)}</>;
  };

  return (
    <div>
      <div
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 10px 7px " + (16 + depth * 20) + "px",
          borderRadius: 10,
          cursor: tieneHijos ? "pointer" : "default",
          transition: "background 0.12s",
          background: "transparent",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#e8f4fa")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        onClick={() => tieneHijos && setAbierto(o => !o)}
      >
        {/* flecha */}
        <span style={{ width: 18, flexShrink: 0, fontSize: 12, color: COLORS.primary, opacity: tieneHijos ? 1 : 0, transition: "transform 0.18s", display: "inline-block", transform: abierto ? "rotate(0deg)" : "rotate(-90deg)" }}>▼</span>
        {/* icono */}
        <span style={{ fontSize: 16, flexShrink: 0 }}>
          {nodo.tipo === "carpeta" ? (depth === 0 ? "📂" : "📁") : iconoArchivo(nodo.extension)}
        </span>
        {/* nombre */}
        <span style={{
          flex: 1, fontSize: 13, fontWeight: nodo.nivel <= 1 ? 700 : nodo.nivel === 2 ? 600 : 400,
          color: COLORS.text, wordBreak: "break-word",
        }}>
          {effectiveUrl && effectiveUrl !== "#"
            ? <a href={effectiveUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ color: COLORS.primary, textDecoration: "none", borderBottom: `1px dotted ${COLORS.primary}` }}>{resaltar(nodo.nombre)}</a>
            : resaltar(nodo.nombre)}
        </span>
        {/* badge contador */}
        {tieneHijos && (
          <span style={{ fontSize: 11, background: `${COLORS.primary}18`, color: COLORS.primary, border: `1px solid ${COLORS.primary}30`, borderRadius: 20, padding: "2px 9px", flexShrink: 0, fontWeight: 600 }}>
            {contarStats(nodo).archivos} arch.
          </span>
        )}
      </div>
      {tieneHijos && abierto && (
        <div style={{ borderLeft: `2px solid ${COLORS.borderLight}`, marginLeft: 16 + depth * 20 + 9 }}>
          {(nodo.hijos ?? []).map((h, i) => <OrgNodoRow key={i} nodo={h} busqueda={busqueda} depth={depth + 1} path={currentPath} />)}
        </div>
      )}
    </div>
  );
}

function ControlDocumentoTab() {
  return <ControlDocumentos />;
}

function UserAvatarButton() {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  const initials = account?.name
    ? account.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: window.location.origin + "/hospital-buin-paine-dashboard/" });
  };

  return (
    <div style={{ padding: "8px 0 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div
        title={account?.name ?? ""}
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: 0.5,
          cursor: "default",
        }}
      >
        {initials}
      </div>
      <button
        onClick={handleLogout}
        title="Cerrar sesión"
        style={{
          background: "transparent", border: "none", cursor: "pointer",
          padding: 4, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
          opacity: 0.5, transition: "opacity 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("Resumen");
  const S = SUMMARY;

  const tabs = [
    { name: "Resumen",      icon: Icons.chart,    color: COLORS.primary },
    { name: "Por Piso",     icon: Icons.layers,   color: COLORS.cyan },
    { name: "Por Servicio", icon: Icons.hospital, color: COLORS.red },
    { name: "Por Producto", icon: Icons.box,      color: COLORS.purple },
    { name: "Por Fecha",    icon: Icons.calendar, color: "#f59e0b" },
    { name: "Esp. Técnicas",      icon: Icons.document, color: "#14b8a6" },
    { name: "Control Documento",  icon: Icons.tree,     color: "#7c3aed" },
  ];

  const EETT_FILES = [
    { code: "201.001", name: "Estación de Trabajo", file: "EETT 201.001 ESTACION DE TRABAJO (REV2).pdf" },
    { code: "201.002", name: "Mesa Lateral", file: "EETT 201.002 MESA LATERAL (REV1).pdf" },
    { code: "201.003", name: "Mesa Párvulo Inclusión", file: "EETT 201.003 MESA PARVULO INCLUSION (REV1).pdf" },
    { code: "201.004", name: "Mesa Párvulo Tipo I", file: "EETT 201.004 MESA PARVULO TIPO I (REV1).pdf" },
    { code: "201.005", name: "Mesa Párvulo Tipo II", file: "EETT 201.005 MESA PARVULO TIPO II (REV1).pdf" },
    { code: "201.008", name: "Mesa Reuniones Tipo I", file: "EETT 201.008 MESA REUNIONES TIPO I (REV1).pdf" },
    { code: "201.009", name: "Mesa Reuniones Tipo II", file: "EETT 201.009 MESA REUNIONES TIPO II (REV3).pdf" },
    { code: "201.010", name: "Mesa Reuniones Tipo III", file: "EETT 201.010 MESA REUNIONES TIPO III (REV3).pdf" },
    { code: "201.011", name: "Mesa Tipo Casino", file: "EETT 201.011 MESA TIPO CASINO (REV1).pdf" },
    { code: "202.001", name: "Atril Graduable", file: "EETT 202.001 ATRIL GRADUABLE (REV1).pdf" },
    { code: "202.006", name: "Cama Apilable", file: "EETT 202.006 CAMA APILABLE (REV1).pdf" },
    { code: "202.008", name: "Cuna Alta", file: "EETT 202.008 CUNA ALTA (REV1).pdf" },
    { code: "202.009", name: "Cuna Baja", file: "EETT 202.009 CUNA BAJA (REV1).pdf" },
    { code: "202.012", name: "Mueble Locker", file: "EETT 202.012 MUEBLE LOCKER (REV1).pdf" },
    { code: "203.014", name: "Librero", file: "EETT 203.014 LIBRERO (REV1).pdf" },
    { code: "203.015", name: "Mueble Arrimo", file: "EETT 203.015 MUEBLE ARRIMO (REV1).pdf" },
    { code: "203.016", name: "Mueble Tipo Biblioteca", file: "EETT 203.016 MUEBLE TIPO BIBLIOTECA.pdf" },
    { code: "203.018", name: "Perchero", file: "EETT 203.018 PERCHERO (REV1).pdf" },
    { code: "203.022", name: "Contenedor", file: "EETT 203.022 CONTENEDOR.pdf" },
    { code: "204.001", name: "Banca", file: "EETT 204.001 BANCA (REV1).pdf" },
    { code: "204.002", name: "Banca Madera", file: "EETT 204.002 BANCA MADERA (REV1).pdf" },
    { code: "204.003", name: "Silla Adulto", file: "EETT 204.003 SILLA ADULTO (REV1).pdf" },
    { code: "204.005", name: "Silla Bacínica", file: "EETT 204.005 SILLA BACINICA (REV1).pdf" },
    { code: "204.006", name: "Silla Ergonómica", file: "EETT 204.006 SILLA ERGONOMICA (REV1).pdf" },
    { code: "204.007", name: "Silla Lactante", file: "EETT 204.007 SILLA LACTANTE (REV1).pdf" },
    { code: "204.009", name: "Silla Párvulo", file: "EETT 204.009 SILLA PARVULO (REV1).pdf" },
    { code: "204.010", name: "Silla Tipo Casino", file: "EETT 204.010 SILLA TIPO CASINO (REV1).pdf" },
    { code: "204.011", name: "Silla Tipo Universitaria", file: "EETT 204.011 SILLA TIPO UNIVERSITARIA (REV1).pdf" },
    { code: "204.012", name: "Silla Visita", file: "EETT 204.012 SILLA VISITA (REV1).pdf" },
    { code: "204.013", name: "Sillón 1 Cuerpo", file: "EETT 204.013 SILLON 1 CUERPO (REV1).pdf" },
    { code: "204.014", name: "Sillón 2 Cuerpo", file: "EETT 204.014 SILLON 2 CUERPO (REV1).pdf" },
    { code: "204.015", name: "Sillón Bergere", file: "EETT 204.015 SILLON BERGERE (REV1).pdf" },
    { code: "204.019", name: "Silla de Apoyo Hora Ingesta", file: "EETT 204.019 SILLA DE APOYO HORA INGESTA.pdf" },
    { code: "204.020", name: "Silla Butaca Espera 3 Cuerpos", file: "EETT 204.020 SILLA BUTACA ESPERA 3 CUERPOS.pdf" },
  ];

  const [selectedEETT, setSelectedEETT] = useState<string | null>(null);
  const [eettSearch, setEettSearch] = useState("");
  const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  return (
    <>
      <UnauthenticatedTemplate>
        <LoginPage />
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      display: "flex",
    }}>
      
      {/* Sidebar oscuro ultra-delgado — solo íconos */}
      <div style={{
        width: 72,
        minWidth: 72,
        background: COLORS.sidebar,
        padding: "20px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
        zIndex: 10,
      }}>
        {/* Nav ítems — SVG glass icons con tooltip */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: "100%", paddingTop: 4 }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                title={tab.name}
                style={{
                  width: 52, height: 52,
                  background: isActive
                    ? `linear-gradient(135deg, ${tab.color} 0%, ${tab.color}cc 100%)`
                    : "transparent",
                  border: "none",
                  borderRadius: 15,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.18s ease",
                  boxShadow: isActive ? `0 4px 16px ${tab.color}55` : "none",
                  padding: 0,
                  marginBottom: 0,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = `${tab.color}22`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                {/* SVG icon — white when active, colored-tint when inactive */}
                <div style={{
                  width: 26, height: 26,
                  opacity: isActive ? 1 : 0.5,
                  filter: isActive ? "none" : `drop-shadow(0 0 0 transparent)`,
                  transition: "opacity 0.18s ease",
                }}>
                  {tab.icon}
                </div>
              </button>
            );
          })}
        </div>

        {/* Separador visual inferior */}
        <div style={{ padding: "16px 0 4px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 32, height: 2, borderRadius: 2,
            background: "rgba(255,255,255,0.12)",
          }} />
        </div>

        {/* Avatar + botón logout */}
        <UserAvatarButton />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto", background: COLORS.bg }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 40px" }}>

          {/* Header estilo "Overview" */}
          <div style={{ marginBottom: 36, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <img
                src={`${import.meta.env.BASE_URL}logo-buin-paine.png`}
                alt="Hospital Buin Paine"
                style={{ height: 72, width: "auto", objectFit: "contain", display: "block", flexShrink: 0 }}
              />
              <div>
              <h1 style={{
                fontSize: 30,
                fontWeight: 800,
                margin: 0,
                color: COLORS.text,
                letterSpacing: "-0.5px",
              }}>
                {activeTab === "Resumen" ? "Resumen General" :
                 activeTab === "Por Piso" ? "Distribución por Piso" :
                 activeTab === "Por Servicio" ? "Análisis por Servicio" :
                 activeTab === "Por Producto" ? "Top Productos" :
                 activeTab === "Por Fecha" ? "Cronograma de Instalación" :
                 activeTab === "Esp. Técnicas" ? "Especificaciones Técnicas" :
                 "Control de Documento"}
              </h1>
              <p style={{
                fontSize: 13,
                color: COLORS.textMuted,
                margin: "6px 0 0 0",
                fontWeight: 400,
              }}>
                Dashboard Mobiliario No Clínico — Hospital Buin Paine
              </p>
              </div>
            </div>
            {/* Badge tab activo */}
            {(() => {
              const activeTabData = tabs.find(t => t.name === activeTab);
              return (
                <div style={{
                  background: `${activeTabData?.color || COLORS.primary}18`,
                  color: activeTabData?.color || COLORS.primary,
                  padding: "8px 16px",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  display: "flex", alignItems: "center", gap: 8,
                  border: `1px solid ${activeTabData?.color || COLORS.primary}30`,
                }}>
                  <div style={{
                    width: 18, height: 18, display: "flex",
                    filter: `brightness(0) saturate(100%) invert(30%) sepia(80%) saturate(500%) hue-rotate(${activeTab === "Por Servicio" ? "0" : "230"}deg)`,
                  }}>
                    {activeTabData?.icon}
                  </div>
                  <span>{activeTab}</span>
                </div>
              );
            })()}
          </div>

          {/* Contenido */}
          {activeTab === "Resumen" && (
            <>
              {/* KPIs principales */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", 
                gap: 16,
                marginBottom: 32,
              }}>
                <KPICard
                  label="Total Items"
                  value={S.totalItems}
                  sub="ítems"
                  icon={Icons.list}
                  color={COLORS.primary}
                />
                <KPICard
                  label="Total Unidades"
                  value={S.totalQty}
                  sub="unidades"
                  icon={Icons.stack}
                  color={COLORS.green}
                />
                <KPICard
                  label="Recintos"
                  value={S.uniqueRecintos}
                  sub="espacios"
                  icon={Icons.location}
                  color={COLORS.orange}
                />
                <KPICard
                  label="Productos"
                  value={S.uniqueNombres}
                  sub="tipos"
                  icon={Icons.tag}
                  color={COLORS.purple}
                />
              </div>

              {/* Status badges */}
              <SectionTitle action="Ver más">Estado del Inventario</SectionTitle>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: 16,
                marginBottom: 32,
              }}>
                <StatusBadge
                  label="Familias"
                  value={S.familias}
                  color={COLORS.green}
                  icon={Icons.folder}
                />
                <StatusBadge
                  label="Proveedores"
                  value={S.proveedores}
                  color={COLORS.orange}
                  icon={Icons.building}
                />
                <StatusBadge
                  label="Servicios"
                  value={S.uniqueServicios}
                  color={COLORS.primary}
                  icon={Icons.hospital}
                />
                <StatusBadge
                  label="Zonas"
                  value={S.uniqueZonas}
                  color={COLORS.purple}
                  icon={Icons.layers}
                />
              </div>

              {/* Charts */}
              <div className="charts-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
                {/* Distribución por Familia - Barras Horizontales (Mobile-optimized) */}
                <div className="chart-card" style={{
                  background: COLORS.white,
                  borderRadius: 18,
                  padding: 24,
                  border: `1px solid ${COLORS.borderLight}`,
                  boxShadow: "0 2px 16px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: COLORS.text,
                    marginBottom: 20,
                    marginTop: 0,
                  }}>
                    Distribución por Familia
                  </h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={S.byFamilia}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                      <XAxis type="number" tick={{ fontSize: 10, fill: COLORS.textMuted }} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fontSize: 12, fill: COLORS.text }}
                        width={95}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="qty" radius={[0, 8, 8, 0]}>
                        {S.byFamilia.map((entry, i) => (
                          <Cell key={i} fill={PIE_FAMILIA_COLORS[entry.name] || CHART_COLORS[i]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="chart-card" style={{
                  background: COLORS.white,
                  borderRadius: 18,
                  padding: 24,
                  border: `1px solid ${COLORS.borderLight}`,
                  boxShadow: "0 2px 16px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: COLORS.text,
                    marginBottom: 20,
                    marginTop: 0,
                  }}>
                    Top Proveedores
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={S.byProveedor}>
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: COLORS.textMuted, fontSize: 11 }}
                        axisLine={{ stroke: COLORS.border }}
                      />
                      <YAxis 
                        tick={{ fill: COLORS.textMuted, fontSize: 11 }}
                        axisLine={{ stroke: COLORS.border }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="qty" name="Cantidad" radius={[6, 6, 0, 0]}>
                        {S.byProveedor.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Análisis Completo de Proveedores */}
              <SectionTitle count={S.proveedores}>Análisis de Proveedores</SectionTitle>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 16,
                marginBottom: 32,
              }}>
                {S.byProveedor.map((p, i) => (
                  <KPICard
                    key={i}
                    label={p.name}
                    value={p.qty}
                    sub={`${((p.qty / S.totalQty) * 100).toFixed(1)}%`}
                    icon={[Icons.building, Icons.building, Icons.building][i] || Icons.building}
                    color={CHART_COLORS[i]}
                  />
                ))}
              </div>

              <div style={{
                background: COLORS.white,
                borderRadius: 18,
                padding: 24,
                border: `1px solid ${COLORS.borderLight}`,
                boxShadow: "0 2px 16px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                marginBottom: 32,
              }}>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: COLORS.text,
                  marginBottom: 20,
                  marginTop: 0,
                }}>
                  Distribución por Proveedor
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={S.byProveedor}>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: COLORS.textMuted, fontSize: 11 }}
                      axisLine={{ stroke: COLORS.border }}
                    />
                    <YAxis
                      tick={{ fill: COLORS.textMuted, fontSize: 11 }}
                      axisLine={{ stroke: COLORS.border }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="qty" name="Cantidad" radius={[6, 6, 0, 0]}>
                      {S.byProveedor.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{
                background: COLORS.white,
                borderRadius: 18,
                padding: 24,
                border: `1px solid ${COLORS.borderLight}`,
                boxShadow: "0 2px 16px rgba(99,102,941,0.05)",
                marginBottom: 32,
              }}>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: COLORS.text,
                  marginBottom: 20,
                  marginTop: 0,
                }}>
                  Detalle de Proveedores
                </h3>
                <DataTable
                  data={S.byProveedor.map((p, i) => ({
                    ...p,
                    rank: i + 1,
                    pctQty: ((p.qty / S.totalQty) * 100).toFixed(1) + "%",
                  }))}
                  columns={[
                    { key: "rank", label: "#", align: "center", mono: true, width: "60px" },
                    { key: "name", label: "Proveedor", highlight: true },
                    { key: "qty", label: "Cantidad", align: "right", mono: true, width: "120px" },
                    { key: "pctQty", label: "% del Total", align: "right", mono: true, width: "120px" },
                    {
                      key: "qty",
                      label: "Distribución",
                      render: (v) => <ProgressBar value={v} max={4256} color={COLORS.green} />
                    },
                  ]}
                  maxRows={10}
                />
              </div>

              {/* Top 5 */}
              <SectionTitle action="Ver todos">Top 5 Productos</SectionTitle>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
                gap: 16,
                marginBottom: 40,
              }}>
                {S.byNombre.slice(0, 5).map((p, i) => (
                  <KPICard
                    key={i}
                    label={p.name}
                    value={p.qty}
                    sub="uds"
                    icon={[Icons.tag, Icons.box, Icons.folder, Icons.stack, Icons.list][i]}
                    color={CHART_COLORS[i]}
                    compact
                  />
                ))}
              </div>

              {/* Tabla de Datos Completa con Filtros */}
              <InventoryDataTable data={RAW} />
            </>
          )}



          {activeTab === "Por Piso" && (
            <>
              <SectionTitle>Distribución por Piso</SectionTitle>
              
              <div style={{
                background: COLORS.white,
                borderRadius: 18,
                padding: 24,
                border: `1px solid ${COLORS.borderLight}`,
                boxShadow: "0 2px 16px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                marginBottom: 24,
              }}>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={S.byPiso}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: COLORS.textMuted, fontSize: 12 }}
                      axisLine={{ stroke: COLORS.border }}
                    />
                    <YAxis 
                      tick={{ fill: COLORS.textMuted, fontSize: 11 }}
                      axisLine={{ stroke: COLORS.border }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="qty" name="Cantidad" radius={[6, 6, 0, 0]}>
                      {S.byPiso.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <DataTable
                data={S.byPiso.map(p => ({
                  ...p,
                  pctQty: ((p.qty / S.totalQty) * 100).toFixed(1) + "%",
                }))}
                columns={[
                  { key: "name", label: "Piso", highlight: true, width: "150px" },
                  { key: "qty", label: "Cantidad", align: "right", mono: true, width: "120px" },
                  { key: "pctQty", label: "% del Total", align: "right", mono: true, width: "120px" },
                  { 
                    key: "qty", 
                    label: "Distribución", 
                    render: (v) => <ProgressBar value={v} max={1547} color={COLORS.orange} /> 
                  },
                ]}
              />

              <SectionTitle>Resumen por Piso</SectionTitle>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
                gap: 16,
              }}>
                {S.byPiso.map(p => (
                  <KPICard 
                    key={p.piso} 
                    label={p.name} 
                    value={p.qty} 
                    sub="unidades" 
                    icon={Icons.layers}
                    color={CHART_COLORS[p.piso - 1]} 
                    compact
                  />
                ))}
              </div>
            </>
          )}

          {activeTab === "Por Servicio" && (
            <>
              <SectionTitle count={S.uniqueServicios}>Cantidad por Servicio</SectionTitle>
              
              <div style={{
                background: COLORS.white,
                borderRadius: 18,
                padding: 24,
                border: `1px solid ${COLORS.borderLight}`,
                boxShadow: "0 2px 16px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                marginBottom: 24,
              }}>
                <ResponsiveContainer width="100%" height={560}>
                  <BarChart data={S.byServicio.slice(0, 20)} layout="vertical" margin={{ left: 10 }}>
                    <XAxis 
                      type="number" 
                      tick={{ fill: COLORS.textMuted, fontSize: 11 }}
                      axisLine={{ stroke: COLORS.border }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={200} 
                      tick={{ fill: COLORS.text, fontSize: 11 }}
                      axisLine={{ stroke: COLORS.border }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="qty" name="Cantidad" radius={[0, 6, 6, 0]}>
                      {S.byServicio.slice(0, 20).map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <DataTable
                data={S.byServicio.map((s, i) => ({
                  ...s,
                  rank: i + 1,
                  pctQty: ((s.qty / S.totalQty) * 100).toFixed(1) + "%",
                }))}
                columns={[
                  { key: "rank", label: "#", align: "center", mono: true, width: "60px" },
                  { key: "name", label: "Servicio", highlight: true },
                  { key: "qty", label: "Cantidad", align: "right", mono: true, width: "120px" },
                  { key: "pctQty", label: "% del Total", align: "right", mono: true, width: "120px" },
                  { 
                    key: "qty", 
                    label: "Distribución", 
                    render: (v) => <ProgressBar value={v} max={825} color={COLORS.primary} /> 
                  },
                ]}
                maxRows={15}
              />
            </>
          )}

          {activeTab === "Por Producto" && (
            <>
              <SectionTitle count={S.uniqueNombres}>Top 25 Productos</SectionTitle>
              
              <div style={{
                background: COLORS.white,
                borderRadius: 18,
                padding: 24,
                border: `1px solid ${COLORS.borderLight}`,
                boxShadow: "0 2px 16px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                marginBottom: 24,
              }}>
                <ResponsiveContainer width="100%" height={600}>
                  <BarChart data={S.byNombre} layout="vertical" margin={{ left: 10 }}>
                    <XAxis 
                      type="number" 
                      tick={{ fill: COLORS.textMuted, fontSize: 11 }}
                      axisLine={{ stroke: COLORS.border }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={220} 
                      tick={{ fill: COLORS.text, fontSize: 11 }}
                      axisLine={{ stroke: COLORS.border }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="qty" name="Cantidad" radius={[0, 6, 6, 0]}>
                      {S.byNombre.map((e, i) => {
                        const c = e.name.includes("Silla") || e.name.includes("Sillón") ? PIE_FAMILIA_COLORS.Silla
                          : e.name.includes("Escritorio") || e.name.includes("Mesa") ? PIE_FAMILIA_COLORS.Mesa
                          : e.name.includes("Mueble") || e.name.includes("Banca") ? PIE_FAMILIA_COLORS.Otro
                          : CHART_COLORS[i % CHART_COLORS.length];
                        return <Cell key={i} fill={c} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <DataTable
                data={S.byNombre.map((n, i) => ({
                  ...n,
                  rank: i + 1,
                  pctQty: ((n.qty / S.totalQty) * 100).toFixed(1) + "%",
                }))}
                columns={[
                  { key: "rank", label: "#", align: "center", mono: true, width: "60px" },
                  { key: "name", label: "Producto", highlight: true },
                  { key: "qty", label: "Cantidad", align: "right", mono: true, width: "120px" },
                  { key: "pctQty", label: "% del Total", align: "right", mono: true, width: "120px" },
                  { 
                    key: "qty", 
                    label: "Distribución", 
                    render: (v) => <ProgressBar value={v} max={1285} color={COLORS.orange} /> 
                  },
                ]}
                maxRows={15}
              />
            </>
          )}


          {activeTab === "Por Fecha" && (
            <>
              <SectionTitle icon={Icons.calendar}>Cronograma de Instalación</SectionTitle>

              {/* KPIs de fechas */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
                marginBottom: 32,
              }}>
                <KPICard
                  label="Fecha Inicio"
                  value={S.fechaStats.fechaMin}
                  sub="primera instalación"
                  icon={Icons.calendar}
                  color={COLORS.green}
                  compact
                />
                <KPICard
                  label="Fecha Término"
                  value={S.fechaStats.fechaMax}
                  sub="última instalación"
                  icon={Icons.calendar}
                  color={COLORS.orange}
                  compact
                />
                <KPICard
                  label="Meses"
                  value={S.fechaStats.totalMeses}
                  sub="de instalación"
                  icon={Icons.chart}
                  color={COLORS.primary}
                  compact
                />
                <KPICard
                  label="Semanas"
                  value={S.fechaStats.totalSemanas}
                  sub="programadas"
                  icon={Icons.layers}
                  color={COLORS.purple}
                  compact
                />
              </div>

              {/* Gráfico por mes */}
              <SectionTitle>Distribución Mensual</SectionTitle>
              <div style={{
                background: COLORS.white,
                borderRadius: 18,
                padding: 24,
                border: `1px solid ${COLORS.borderLight}`,
                boxShadow: "0 2px 16px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                marginBottom: 24,
              }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={S.byMes}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: COLORS.textMuted, fontSize: 12 }}
                      axisLine={{ stroke: COLORS.border }}
                    />
                    <YAxis 
                      tick={{ fill: COLORS.textMuted, fontSize: 11 }}
                      axisLine={{ stroke: COLORS.border }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="qty" name="Cantidad" radius={[6, 6, 0, 0]}>
                      {S.byMes.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Tabla mensual */}
              <DataTable
                data={S.byMes.map((m, i) => ({
                  ...m,
                  rank: i + 1,
                  pctQty: ((m.qty / S.totalQty) * 100).toFixed(1) + "%",
                }))}
                columns={[
                  { key: "rank", label: "#", align: "center", mono: true, width: "60px" },
                  { key: "name", label: "Mes", highlight: true, width: "200px" },
                  { key: "qty", label: "Cantidad", align: "right", mono: true, width: "120px" },
                  { key: "pctQty", label: "% del Total", align: "right", mono: true, width: "120px" },
                  { 
                    key: "qty", 
                    label: "Distribución", 
                    render: (v) => <ProgressBar value={v} max={4069} color={COLORS.primary} /> 
                  },
                ]}
                maxRows={4}
              />

              {/* Top semanas */}
              <SectionTitle>Top 5 Semanas con Más Instalaciones</SectionTitle>
              <div style={{
                background: COLORS.white,
                borderRadius: 18,
                padding: 24,
                border: `1px solid ${COLORS.borderLight}`,
                boxShadow: "0 2px 16px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                marginBottom: 24,
              }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={S.bySemana}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: COLORS.textMuted, fontSize: 11 }}
                      axisLine={{ stroke: COLORS.border }}
                      angle={-15}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fill: COLORS.textMuted, fontSize: 11 }}
                      axisLine={{ stroke: COLORS.border }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="qty" name="Cantidad" radius={[6, 6, 0, 0]}>
                      {S.bySemana.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top días */}
              <SectionTitle>Top 5 Días con Más Instalaciones</SectionTitle>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: 16,
                marginBottom: 24,
              }}>
                {S.byDia.map((d, i) => (
                  <StatusBadge
                    key={i}
                    label={d.name}
                    value={d.qty}
                    color={CHART_COLORS[i]}
                    icon={Icons.calendar}
                  />
                ))}
              </div>

              {/* Alerta de pico */}
              <div style={{
                background: `${COLORS.orange}10`,
                border: `1px solid ${COLORS.orange}40`,
                borderRadius: 18,
                padding: 20,
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  background: COLORS.orange,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}>
                  ⚠️
                </div>
                <div>
                  <div style={{ 
                    fontSize: 16, 
                    fontWeight: 700, 
                    color: COLORS.text,
                    marginBottom: 6,
                  }}>
                    Pico de Instalación Detectado
                  </div>
                  <div style={{ 
                    fontSize: 14, 
                    color: COLORS.textMuted,
                    lineHeight: 1.5,
                  }}>
                    El 01/07/2026 concentra <strong style={{color: COLORS.text}}>2,924 unidades</strong> ({((2924/S.totalQty)*100).toFixed(1)}% del total). 
                    Se recomienda coordinar recursos adicionales de instalación para esta fecha.
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "Esp. Técnicas" && (
            <>
              <SectionTitle count={`${EETT_FILES.length}`} icon={Icons.document}>Especificaciones Técnicas de Mobiliario</SectionTitle>

              {/* Barra de búsqueda + chips en una sola fila */}
              <div style={{
                background: COLORS.white,
                borderRadius: 18,
                border: `1px solid ${COLORS.borderLight}`,
                boxShadow: "0 2px 16px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                height: 52,
              }}>
                {/* Input fijo a la izquierda */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "0 14px", borderRight: `1px solid ${COLORS.border}`,
                  flexShrink: 0, height: "100%",
                }}>
                  <span style={{ fontSize: 14, color: COLORS.textMuted }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={eettSearch}
                    onChange={(e) => setEettSearch(e.target.value)}
                    style={{
                      width: 140, padding: "0", border: "none", outline: "none",
                      fontSize: 13, color: COLORS.text, background: "transparent",
                    }}
                  />
                  {eettSearch && (
                    <button
                      onClick={() => setEettSearch("")}
                      style={{ border: "none", background: "none", cursor: "pointer", color: COLORS.textMuted, fontSize: 16, lineHeight: 1, padding: 0 }}
                    >×</button>
                  )}
                </div>

                {/* Chips desplazables horizontalmente */}
                <div style={{
                  display: "flex", gap: 6, alignItems: "center",
                  overflowX: "auto", padding: "0 12px", flex: 1, height: "100%",
                  scrollbarWidth: "none",
                }}>
                  {(() => {
                    const filtered = EETT_FILES.filter(f =>
                      normalize(f.name).includes(normalize(eettSearch)) ||
                      normalize(f.code).includes(normalize(eettSearch))
                    );
                    if (filtered.length === 0)
                      return <span style={{ fontSize: 12, color: COLORS.textMuted, whiteSpace: "nowrap" }}>Sin resultados para "{eettSearch}"</span>;
                    return filtered.map((f) => (
                      <button
                        key={f.code}
                        onClick={() => { setSelectedEETT(f.file); setEettSearch(""); }}
                        style={{
                          padding: "4px 11px", borderRadius: 20, flexShrink: 0,
                          border: `1px solid ${selectedEETT === f.file ? COLORS.primary : COLORS.border}`,
                          background: selectedEETT === f.file ? COLORS.primary : COLORS.bg,
                          color: selectedEETT === f.file ? COLORS.white : COLORS.text,
                          fontSize: 12, fontWeight: selectedEETT === f.file ? 600 : 400,
                          cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease",
                        }}
                      >
                        <span style={{ fontFamily: "monospace", fontSize: 10, opacity: 0.7, marginRight: 4 }}>{f.code}</span>
                        {f.name}
                      </button>
                    ));
                  })()}
                </div>
              </div>

              {/* Visor PDF — ancho completo */}
              <div style={{
                background: COLORS.white,
                borderRadius: 18,
                border: `1px solid ${COLORS.borderLight}`,
                boxShadow: "0 2px 16px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: 700,
              }}>
                {selectedEETT ? (
                  <>
                    <div style={{
                      padding: "11px 16px",
                      borderBottom: `1px solid ${COLORS.border}`,
                      background: COLORS.bg,
                      fontSize: 13, fontWeight: 600, color: COLORS.text,
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <span style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.primary }}>
                        {EETT_FILES.find(f => f.file === selectedEETT)?.code}
                      </span>
                      <span style={{ color: COLORS.textMuted }}>—</span>
                      {EETT_FILES.find(f => f.file === selectedEETT)?.name}
                    </div>
                    <PdfViewer key={selectedEETT} url={`${import.meta.env.BASE_URL}eett/${encodeURIComponent(selectedEETT)}`} />
                  </>
                ) : (
                  <div style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    color: COLORS.textMuted, gap: 12, minHeight: 500,
                  }}>
                    <div style={{ fontSize: 48 }}>📋</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.text }}>Selecciona una especificación</div>
                    <div style={{ fontSize: 13 }}>Busca por nombre o código y haz clic en el chip para ver la ficha técnica</div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "Control Documento" && <ControlDocumentoTab />}

          {/* Footer */}
          <div style={{
            marginTop: 48,
            padding: "20px 0",
            borderTop: `1px solid ${COLORS.border}`,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: COLORS.textMuted,
          }}>
            <span>Hospital Buin Paine • Mobiliario No Clínico</span>
            <span>Fuente: MNC_Claude_20260209.xlsx • {S.totalQty.toLocaleString("es-CL")} unidades</span>
          </div>
        </div>
      </div>
    </div>
      </AuthenticatedTemplate>
    </>
  );
}
