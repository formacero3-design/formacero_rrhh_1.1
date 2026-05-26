import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchWithAuth } from "../../utils/api";
import "../../layout.css";
import "./empleado-detalle.css";
import "./documentos.css";

const DEFAULT_PROFILE_IMAGE = "/default-profile.svg";

function EmpleadoDetalle() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [empleado, setEmpleado] = useState(null);
  const [activeSection, setActiveSection] = useState("info");
  const [showContactoEmergencia, setShowContactoEmergencia] = useState(false);
  const [reportes, setReportes] = useState([]);
  const [loadingReportes, setLoadingReportes] = useState(false);
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseData, setResponseData] = useState({ comentario: '', archivo: null });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ nombre: '', telefono: '', direccion: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [nuevoDocumento, setNuevoDocumento] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [editingDocument, setEditingDocument] = useState(null);
  const [cargandoDocumento, setCargandoDocumento] = useState(false);
  const [showDocumentoForm, setShowDocumentoForm] = useState(false);

  const [contactoForm, setContactoForm] = useState({
    nombre: "",
    relacion: "",
    telefono_principal: "",
    telefono_alternativo: "",
    direccion: "",
    ciudad: ""
  });
  const [editingContacto, setEditingContacto] = useState(null);
  const [showContactoEditor, setShowContactoEditor] = useState(false);
  const [contactoLoading, setContactoLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const currentEmployeeId = currentUser?.empleado_id ?? currentUser?.id;
  const isOwnProfile = String(id) === String(currentEmployeeId);
  const isAdmin = currentUser?.rol === "admin";
  const canViewAssignedReports = isOwnProfile && ["user", "empleado", "usuario"].includes(currentUser?.rol);
  const canEditDocuments = isAdmin || isOwnProfile;
  const canEditProfile = isAdmin || isOwnProfile;

  // ✅ TOKEN
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const allowedEmployeeId = String(user?.empleado_id || user?.id || "");

  const fetchEmpleado = async () => {
    try {
      const res = await fetchWithAuth(`/empleados/${id}`);

      if (!res.ok) throw new Error("Empleado no encontrado");

      const data = await res.json();
      setEmpleado(data);
      if (data.documentos) {
        setDocumentos(data.documentos);
      }
      setEditData({
        nombre: data.nombre || '',
        telefono: data.telefono || '',
        direccion: data.direccion || ''
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReportes = async () => {
    if (!canViewAssignedReports) return;
    setLoadingReportes(true);
    try {
      const res = await fetchWithAuth("/reportes");
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) {
        setReportes([]);
        return;
      }

      const filtered = data.filter((reporte) => String(reporte.empleado_id) === String(currentEmployeeId));
      setReportes(filtered);
    } catch (error) {
      console.error("Error cargando reportes:", error);
      setReportes([]);
    } finally {
      setLoadingReportes(false);
    }
  };

  useEffect(() => {

    // 🔥 PROTECCIÓN
    if (!token) {
      navigate("/login");
      return;
    }

    fetchEmpleado();
    fetchReportes();

  }, [id, token, navigate, canViewAssignedReports, currentEmployeeId]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "reportes" && canViewAssignedReports) {
      setActiveSection("reportes");
    } else {
      setActiveSection("info");
    }
  }, [searchParams, canViewAssignedReports]);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        setSuccessMessage("");
      }, 3000); // Cerrar automáticamente después de 3 segundos
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleProfilePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('La foto no debe superar los 2MB.');
      e.target.value = null;
      return;
    }
    setProfilePhoto(file);
  };

  const resetContactoForm = () => {
    setContactoForm({
      nombre: "",
      relacion: "",
      telefono_principal: "",
      telefono_alternativo: "",
      direccion: "",
      ciudad: ""
    });
    setEditingContacto(null);
  };

  const handleContactoFormChange = (field, value) => {
    setContactoForm({ ...contactoForm, [field]: value });
  };

  const startNewContacto = () => {
    resetContactoForm();
    setShowContactoEditor(true);
  };

  const startEditContacto = (contacto) => {
    setContactoForm({
      nombre: contacto.nombre || "",
      relacion: contacto.relacion || "",
      telefono_principal: contacto.telefono_principal || "",
      telefono_alternativo: contacto.telefono_alternativo || "",
      direccion: contacto.direccion || "",
      ciudad: contacto.ciudad || ""
    });
    setEditingContacto(contacto);
    setShowContactoEditor(true);
  };

  const cancelarContacto = () => {
    resetContactoForm();
    setShowContactoEditor(false);
  };

  const saveContacto = async () => {
    if (!contactoForm.nombre || !contactoForm.relacion || !contactoForm.telefono_principal) {
      alert("Nombre, relación y teléfono principal son obligatorios.");
      return;
    }

    setContactoLoading(true);
    try {
      const method = editingContacto ? "PUT" : "POST";
      const endpoint = editingContacto
        ? `/empleados/${id}/contacto-emergencia/${editingContacto.id}`
        : `/empleados/${id}/contacto-emergencia`;

      const res = await fetchWithAuth(endpoint, {
        method,
        body: JSON.stringify(contactoForm)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error guardando contacto de emergencia");
      }

      await fetchEmpleado();
      setSuccessMessage(editingContacto ? "Contacto actualizado correctamente." : "Contacto agregado correctamente.");
      setShowSuccessModal(true);
      setShowContactoEditor(false);
      resetContactoForm();
    } catch (error) {
      console.error("Error guardando contacto de emergencia:", error);
      alert(error.message || "No se pudo guardar el contacto de emergencia.");
    } finally {
      setContactoLoading(false);
    }
  };

  const confirmarGuardar = () => {
    setShowConfirmModal(true);
  };

  const handleDocumentoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNuevoDocumento(file);
      if (!documentName) {
        setDocumentName(file.name);
      }
    }
  };

  const resetDocumentoForm = () => {
    setNuevoDocumento(null);
    setDocumentName("");
    setEditingDocument(null);
    setShowDocumentoForm(false);
  };

  const startEditDocumento = (doc) => {
    setEditingDocument(doc);
    setDocumentName(doc.nombre_original || "");
    setNuevoDocumento(null);
    setShowDocumentoForm(true);
  };

  const deleteDocumento = async (doc) => {
    if (!confirm(`¿Eliminar documento "${doc.nombre_original}"?`)) {
      return;
    }

    const documentoId = doc.id ?? doc.documento_id ?? doc.documentoId;
    if (!documentoId) {
      alert('No se pudo identificar el documento a eliminar.');
      return;
    }

    try {
      const res = await fetchWithAuth(`/empleados/${id}/documentos/${documentoId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error eliminando documento');
      }

      await fetchEmpleado();
      setSuccessMessage('Documento eliminado correctamente.');
      setShowSuccessModal(true);
      if (editingDocument && editingDocument.id === doc.id) {
        resetDocumentoForm();
      }
    } catch (error) {
      console.error('Error eliminando documento:', error);
      alert(error.message || 'No se pudo eliminar el documento');
    }
  };

  const cargarDocumento = async () => {
    if (!editingDocument && !nuevoDocumento) {
      alert('Selecciona un archivo primero');
      return;
    }

    setCargandoDocumento(true);
    try {
      const formData = new FormData();
      if (nuevoDocumento) {
        formData.append('documento', nuevoDocumento);
      }
      if (documentName) {
        formData.append('nombre_original', documentName);
      }

      const documentoId = editingDocument?.id ?? editingDocument?.documento_id ?? editingDocument?.documentoId;
      const endpoint = editingDocument
        ? `/empleados/${id}/documentos/${documentoId}`
        : `/empleados/${id}/documentos`;
      const method = editingDocument ? 'POST' : 'POST';

      const res = await fetchWithAuth(endpoint, {
        method,
        body: formData
      });

      if (res.ok) {
        await fetchEmpleado();
        setSuccessMessage(editingDocument ? 'Documento actualizado correctamente.' : 'Documento cargado exitosamente.');
        setShowSuccessModal(true);
        resetDocumentoForm();
      } else {
        const error = await res.json();
        alert(`Error guardando documento: ${error.message}`);
      }
    } catch (error) {
      console.error('Error guardando documento:', error);
      alert('Error al guardar el documento');
    } finally {
      setCargandoDocumento(false);
    }
  };

  const guardarCambios = async () => {
    setIsSaving(true);
    try {
      let res;

      if (profilePhoto) {
        const formData = new FormData();
        formData.append('nombre', editData.nombre);
        formData.append('telefono', editData.telefono);
        formData.append('direccion', editData.direccion);
        formData.append('foto', profilePhoto);

        res = await fetchWithAuth(`/empleados/${id}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        res = await fetchWithAuth(`/empleados/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            nombre: editData.nombre,
            telefono: editData.telefono,
            direccion: editData.direccion
          })
        });
      }

      if (res.ok) {
        const empleadoRes = await fetchWithAuth(`/empleados/${id}`);
        if (empleadoRes.ok) {
          const empleadoActualizado = await empleadoRes.json();
          setEmpleado(empleadoActualizado);
          
          // 🔄 ACTUALIZAR USUARIO EN LOCALSTORAGE SI ES PERFIL PROPIO
          if (isOwnProfile) {
            const usuarioActualizado = {
              ...currentUser,
              nombre: empleadoActualizado.nombre,
              foto_url: empleadoActualizado.foto_url
            };
            localStorage.setItem("user", JSON.stringify(usuarioActualizado));
          }
        } else {
          setEmpleado({
            ...empleado,
            nombre: editData.nombre,
            telefono: editData.telefono,
            direccion: editData.direccion,
          });
        }

        setIsEditing(false);
        setShowConfirmModal(false);
        setSuccessMessage('Información actualizada correctamente.');
        setShowSuccessModal(true);
      } else {
        alert('Error al actualizar la información');
      }
    } catch (error) {
      console.error('Error guardando cambios:', error);
      alert('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
      setProfilePhoto(null);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-CO");
  };

  const maskEmail = (email) => {
    if (!email || !email.includes("@")) return email || "-";
    const [local, domain] = email.split("@");
    if (local.length <= 3) return `${local[0]}****@${domain}`;
    const visibleStart = local.slice(0, 2);
    const visibleEnd = local.slice(-2);
    return `${visibleStart}****${visibleEnd}@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return "-";
    const digits = phone.replace(/\D/g, "");
    if (digits.length <= 6) return `${digits.slice(0, 3)}****${digits.slice(-3)}`;
    return `${digits.slice(0, 3)}****${digits.slice(-4)}`;
  };

  const getIngresoLabel = (fecha) => {
    if (!fecha) return "-";
    const date = new Date(fecha);
    return isOwnProfile ? formatFecha(fecha) : date.getFullYear();
  };

  async function enviarRespuesta(reporteId) {
    try {
      const formData = new FormData();
      formData.append('respuesta_empleado', responseData.comentario);
      if (responseData.archivo) {
        formData.append('archivo_excusa', responseData.archivo);
      }

      const res = await fetchWithAuth(`/reportes/${reporteId}/responder`, {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        setRespondingTo(null);
        setResponseData({ comentario: '', archivo: null });
        fetchReportes();
        setSuccessMessage("Reporte enviado correctamente, pronto recibirás una respuesta.");
        setShowSuccessModal(true);
      } else {
        alert("Error al enviar la respuesta");
      }
    } catch (error) {
      console.error("Error enviando respuesta:", error);
      alert("Error al enviar la respuesta");
    }
  }

  if (!empleado) {
    return <p style={{ padding: "20px" }}>Cargando empleado...</p>;
  }

  return (
    <div>

      {/* HEADER */}
      <header className="header">
        <div className="logo">Formacero</div>
        <Link to="/dashboard" className="back-btn">← Volver</Link>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>Perfil del Empleado</h1>
        <p>Información completa del colaborador</p>
      </section>

      {/* CONTENIDO */}
      <section className="detalle-container">
        <div className="detalle-wrapper">
          {canViewAssignedReports && (
            <div className="detalle-tabs">
              <button
                type="button"
                className={`tab-btn ${activeSection === "info" ? "active" : ""}`}
                onClick={() => setActiveSection("info")}
              >
                Información
              </button>
              <button
                type="button"
                className={`tab-btn ${activeSection === "reportes" ? "active" : ""}`}
                onClick={() => setActiveSection("reportes")}
              >
                Mis Reportes
              </button>
            </div>
          )}

          {activeSection === "info" && (
            <div className="perfil-card">
              <div className="perfil-header">
                <div className="avatar">
                  <img
                    src={empleado.foto_url || DEFAULT_PROFILE_IMAGE}
                    alt={empleado.nombre || "Perfil"}
                    className="perfil-avatar-img"
                  />
                </div>

                <div className="perfil-info-header">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.nombre}
                      onChange={(e) => handleEditChange('nombre', e.target.value)}
                      className="edit-input-nombre"
                    />
                  ) : (
                    <h2>{empleado.nombre}</h2>
                  )}
                  <p>{empleado.cargo}</p>
                  {isEditing && (
                    <div className="photo-upload-field">
                      <label htmlFor="profilePhoto">Actualizar foto de perfil</label>
                      <input
                        id="profilePhoto"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePhoto}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="info-grid">
                <p><strong>Cargo:</strong> {empleado.cargo || "Sin cargo"}</p>
                <p><strong>Departamento:</strong> {empleado.departamento || empleado.departamentos?.nombre || "Sin asignar"}</p>
                <p><strong>Correo:</strong> {isOwnProfile ? empleado.correo : maskEmail(empleado.correo)}</p>
                <p><strong>Teléfono:</strong> {isOwnProfile ? (empleado.telefono || "-") : maskPhone(empleado.telefono)}</p>
                <p><strong>Ingreso:</strong> {getIngresoLabel(empleado.fecha_ingreso)}</p>

                {isOwnProfile && (
                  <>
                    <p><strong>Cédula:</strong> {empleado.documento}</p>
                    <p><strong>Salario:</strong> ${empleado.salario || "0"}</p>
                    <p><strong>Nacimiento:</strong> {formatFecha(empleado.fecha_nacimiento)}</p>
                    <p>
                      <strong>Dirección:</strong> {" "}
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.direccion}
                          onChange={(e) => handleEditChange('direccion', e.target.value)}
                          className="edit-input"
                        />
                      ) : (
                        empleado.direccion || '-'
                      )}
                    </p>
                  </>
                )}
              </div>

              {canEditProfile && (
                <div className="edit-actions">
                  {!isEditing ? (
                    <button
                      type="button"
                      className="btn-editar"
                      onClick={() => setIsEditing(true)}
                    >
                      Editar Información
                    </button>
                  ) : (
                    <div className="edit-buttons">
                      <button
                        type="button"
                        className="btn-guardar"
                        onClick={confirmarGuardar}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
                      <button
                        type="button"
                        className="btn-cancelar"
                        onClick={() => {
                          setIsEditing(false);
                          setEditData({
                            nombre: empleado.nombre || '',
                            telefono: empleado.telefono || '',
                            direccion: empleado.direccion || ''
                          });
                        }}
                        disabled={isSaving}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              )}

              {(isOwnProfile || isAdmin) && (
                <div className="contacto-card">
                  <div className="contacto-header">
                    <div>
                      <h3>Contacto de Emergencia</h3>
                      <p className="subtitulo">Información confidencial y disponible en caso de emergencia</p>
                    </div>
                    <div className="contacto-buttons">
                      <button
                        type="button"
                        className="toggle-contacto-btn"
                        onClick={() => setShowContactoEmergencia(!showContactoEmergencia)}
                      >
                        {showContactoEmergencia ? "Ocultar" : "Mostrar"}
                      </button>
                      {canViewAssignedReports && (
                        <button
                          type="button"
                          className="btn-agregar-contacto"
                          onClick={showContactoEditor ? cancelarContacto : startNewContacto}
                        >
                          {showContactoEditor ? "Cancelar" : "+ Agregar contacto"}
                        </button>
                      )}
                    </div>
                  </div>

                  {showContactoEmergencia && (
                    <div className="contacto-details">
                      {empleado.contactos_emergencia && empleado.contactos_emergencia.length > 0 ? (
                        empleado.contactos_emergencia.map((contacto) => (
                          <div key={contacto.id} className="contacto-item">
                            <div className="contacto-item-header">
                              <h4>{contacto.nombre}</h4>
                              {canViewAssignedReports && (
                                <button
                                  type="button"
                                  className="btn-editar-contacto"
                                  onClick={() => startEditContacto(contacto)}
                                >
                                  Editar
                                </button>
                              )}
                            </div>
                            <p><strong>Relación:</strong> {contacto.relacion}</p>
                            <p><strong>Teléfono principal:</strong> {contacto.telefono_principal}</p>
                            <p><strong>Teléfono alternativo:</strong> {contacto.telefono_alternativo || "-"}</p>
                            <p><strong>Dirección:</strong> {contacto.direccion || "-"}</p>
                            <p><strong>Ciudad:</strong> {contacto.ciudad || "-"}</p>
                            <p><strong>Autorización:</strong> {contacto.autorizacion ? "Sí" : "No"}</p>
                          </div>
                        ))
                      ) : (
                        <p>No se encontró información de contacto de emergencia.</p>
                      )}
                    </div>
                  )}

                  {showContactoEditor && (
                    <div className="contacto-formulario">
                      <h4>{editingContacto ? "Editar contacto de emergencia" : "Agregar contacto de emergencia"}</h4>
                      <div className="form-group">
                        <label>Nombre</label>
                        <input
                          type="text"
                          value={contactoForm.nombre}
                          onChange={(e) => handleContactoFormChange('nombre', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Relación</label>
                        <input
                          type="text"
                          value={contactoForm.relacion}
                          onChange={(e) => handleContactoFormChange('relacion', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Teléfono principal</label>
                        <input
                          type="tel"
                          value={contactoForm.telefono_principal}
                          onChange={(e) => handleContactoFormChange('telefono_principal', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Teléfono alternativo</label>
                        <input
                          type="tel"
                          value={contactoForm.telefono_alternativo}
                          onChange={(e) => handleContactoFormChange('telefono_alternativo', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Dirección</label>
                        <input
                          type="text"
                          value={contactoForm.direccion}
                          onChange={(e) => handleContactoFormChange('direccion', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Ciudad</label>
                        <input
                          type="text"
                          value={contactoForm.ciudad}
                          onChange={(e) => handleContactoFormChange('ciudad', e.target.value)}
                        />
                      </div>
                      <div className="form-actions">
                        <button
                          type="button"
                          className="btn-guardar"
                          onClick={saveContacto}
                          disabled={contactoLoading}
                        >
                          {contactoLoading
                            ? (editingContacto ? "Guardando cambios..." : "Guardando...")
                            : (editingContacto ? "Guardar cambios" : "Agregar contacto")}
                        </button>
                        <button
                          type="button"
                          className="btn-cancelar"
                          onClick={cancelarContacto}
                          disabled={contactoLoading}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(isOwnProfile || isAdmin) && (
                <div className="documentos-card">
                  <div className="documentos-header">
                    <h3>📄 Documentos</h3>
                    {canEditDocuments && (
                      <button
                        type="button"
                        className="btn-agregar-documento"
                        onClick={() => {
                          if (showDocumentoForm) {
                            resetDocumentoForm();
                          } else {
                            setShowDocumentoForm(true);
                          }
                        }}
                      >
                        {showDocumentoForm ? "Cancelar" : editingDocument ? "Cancelar edición" : "+ Agregar Documento"}
                      </button>
                    )}
                  </div>

                  {showDocumentoForm && canEditDocuments && (
                    <div className="documento-form">
                      <div className="form-group">
                        <label>Nombre del documento</label>
                        <input
                          type="text"
                          value={documentName}
                          onChange={(e) => setDocumentName(e.target.value)}
                          placeholder="Nombre a mostrar (opcional)"
                        />
                      </div>
                      <div className="form-group">
                        <label>{editingDocument ? "Reemplazar archivo" : "Seleccionar archivo"}</label>
                        <input
                          type="file"
                          onChange={handleDocumentoChange}
                          accept=".pdf,.doc,.docx,.xlsx,.jpg,.jpeg,.png"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn-cargar-documento"
                        onClick={cargarDocumento}
                        disabled={cargandoDocumento || (!editingDocument && !nuevoDocumento)}
                      >
                        {cargandoDocumento
                          ? "Guardando..."
                          : editingDocument
                            ? "Actualizar Documento"
                            : "Subir Documento"}
                      </button>
                    </div>
                  )}

                  <div className="documentos-list">
                    {documentos && documentos.length > 0 ? (
                      documentos.map((doc) => (
                        <div key={doc.id} className="documento-item">
                          <div className="documento-info">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="documento-link">
                              📎 {doc.nombre_original}
                            </a>
                            <p className="documento-fecha">{new Date(doc.fecha_subida).toLocaleDateString("es-CO")}</p>
                          </div>
                          {canEditDocuments && (
                            <div className="doc-actions">
                              <button
                                type="button"
                                className="btn-editar-contacto"
                                onClick={() => startEditDocumento(doc)}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="btn-eliminar-documento"
                                onClick={() => deleteDocumento(doc)}
                              >
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="sin-documentos">No hay documentos cargados.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        {activeSection === "reportes" && canViewAssignedReports && (
          <div className="reportes-panel">
            <h2>Reportes asignados</h2>
            {loadingReportes ? (
              <p className="loading-message">Cargando reportes asignados...</p>
            ) : reportes.length === 0 ? (
              <p className="empty-message">No tienes reportes asignados.</p>
            ) : (
              <div className="reportes-list">
                {reportes.map((reporte) => (
                  <div key={reporte.id} className="reporte-card">
                    <div className="reporte-header">
                      <span>{formatFecha(reporte.fecha)}</span>
                      <span className={`status ${reporte.estado === "resuelto" ? "resuelto" : "pendiente"}`}>
                        {reporte.estado}
                      </span>
                    </div>
                    <p className="reporte-descripcion">{reporte.descripcion}</p>
                    <p><strong>Decisión:</strong> {reporte.decision || "Sin decisión"}</p>
                    
                    {reporte.respuesta_empleado && (
                      <div className="respuesta-empleado">
                        <p><strong>Tu respuesta:</strong> {reporte.respuesta_empleado}</p>
                        {reporte.archivo_excusa && (
                          <p><strong>Archivo adjunto:</strong> {reporte.archivo_excusa}</p>
                        )}
                        {reporte.fecha_respuesta && (
                          <p><small>Respondido el: {formatFecha(reporte.fecha_respuesta)}</small></p>
                        )}
                      </div>
                    )}

                    {!reporte.respuesta_empleado && (
                      <div className="respuesta-actions">
                        {respondingTo === reporte.id ? (
                          <div className="respuesta-form">
                            <textarea
                              placeholder="Escribe tu respuesta o explicación..."
                              value={responseData.comentario}
                              onChange={(e) => setResponseData({...responseData, comentario: e.target.value})}
                              required
                            />
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) => setResponseData({...responseData, archivo: e.target.files[0]})}
                            />
                            <div className="form-actions">
                              <button onClick={() => enviarRespuesta(reporte.id)} type="button">Enviar Respuesta</button>
                              <button type="button" onClick={() => setRespondingTo(null)}>Cancelar</button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            className="btn-responder" 
                            onClick={() => setRespondingTo(reporte.id)}
                          >
                            Responder
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
      </section>

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirmModal && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <div className="confirm-icon">✏️</div>
            <h2>Confirmar Cambios</h2>
            <p>¿Estás seguro de que deseas actualizar la información del empleado?</p>
            
            <div className="confirm-changes-preview">
              {editData.nombre !== empleado.nombre && (
                <p><strong>Nombre:</strong> {empleado.nombre} → {editData.nombre}</p>
              )}
              {editData.telefono !== empleado.telefono && (
                <p><strong>Teléfono:</strong> {empleado.telefono || '-'} → {editData.telefono}</p>
              )}
              {editData.direccion !== empleado.direccion && (
                <p><strong>Dirección:</strong> {empleado.direccion || '-'} → {editData.direccion}</p>
              )}
            </div>

            <div className="confirm-actions">
              <button 
                className="confirm-btn cancel" 
                onClick={() => setShowConfirmModal(false)}
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button 
                className="confirm-btn confirm" 
                onClick={guardarCambios}
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ÉXITO */}
      {showSuccessModal && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-icon">✅</div>
            <h2>¡Éxito!</h2>
            <p>{successMessage || "La acción se completó correctamente."}</p>
            <div className="success-actions">
              <button 
                className="success-btn" 
                onClick={() => setShowSuccessModal(false)}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        © {new Date().getFullYear()} Formacero
      </footer>

    </div>
  );
}

export default EmpleadoDetalle;
