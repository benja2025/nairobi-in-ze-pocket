import React from 'react';
import { MOCK_EMERGENCY_CONTACTS } from '../../data/mockEmergency';
import { PhoneCall, ShieldAlert, Ambulance, Building2, Pill, Shield, MapPin, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmergencyPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-24">
      {/* SOS Banner */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-sos-950 via-slate-900 to-slate-950 border-sos-600/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sos-600/10 rounded-full blur-2xl animate-pulse" />
        <div className="flex items-center space-x-2 text-sos-400 font-bold text-xs uppercase tracking-widest mb-2">
          <Zap className="w-4 h-4 animate-bounce" />
          <span>Accès Instantané Offline 24/7</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-50 tracking-tight">
          Urgences SOS Nairobi
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
          Numéros d'urgence vitale à Nairobi : hôpitaux de référence, ambulances réanimatrices, urgence consulaire et pharmacies de garde.
        </p>
      </div>

      {/* Primary Emergency Cards List */}
      <div className="space-y-3.5">
        {MOCK_EMERGENCY_CONTACTS.map((item) => {
          const cleanPhone = item.phone.replace(/\s+/g, '');
          const cleanSecondary = item.secondaryPhone ? item.secondaryPhone.replace(/\s+/g, '') : null;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-2xl p-4 sm:p-5 border-sos-600/30 bg-slate-900/90 hover:border-sos-500/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sos-600/20 text-sos-400 border border-sos-500/30">
                    {item.category === 'hospital' && '🏥 Hôpital'}
                    {item.category === 'ambulance' && '🚑 Ambulance'}
                    {item.category === 'embassy' && '🇫🇷 Consulat'}
                    {item.category === 'pharmacy' && '💊 Pharmacie'}
                    {item.category === 'security' && '🚨 Sécurité'}
                  </span>
                  {item.is247 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      24h/24 & 7j/7
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-slate-50">{item.title}</h3>

                {item.neighborhood && (
                  <p className="text-xs text-slate-400 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{item.neighborhood} — {item.address}</span>
                  </p>
                )}

                {item.notes && (
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                    {item.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-sos-600 hover:bg-sos-700 text-white font-extrabold text-xs transition-all shadow-md shadow-sos-600/30 active:scale-95 text-center"
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span>Appeler {item.phone}</span>
                </a>

                {cleanSecondary && (
                  <a
                    href={`tel:${cleanSecondary}`}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all text-center"
                  >
                    <span>Ligne 2 ({item.secondaryPhone})</span>
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EmergencyPage;
