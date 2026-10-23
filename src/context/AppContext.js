import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { fetchModels } from '../services';
import { REFERENCE_LOCATION } from '../services/config';

/**
 * Estado compartilhado entre as telas:
 *  - lista de modelos e o modelo selecionado, com persistência local
 *    (reabre o app no mesmo modelo — AsyncStorage);
 *  - localização: pede permissão ao usuário; se concedida, usa a posição
 *    aproximada do aparelho; se negada ou indisponível, usa São Paulo;
 *  - probe correspondente (preenchida pela tela inicial via /nearby),
 *    reutilizada pela linha do tempo.
 */
const AppContext = createContext(null);
const MODEL_KEY = 'sinalcerto:selectedModelId';

export function AppProvider({ children }) {
  const [models, setModels] = useState([]);
  const [selectedModelId, setSelectedModelIdState] = useState(null);
  const [modelsSource, setModelsSource] = useState(null);
  const [loadingModels, setLoadingModels] = useState(true);
  const [probeId, setProbeId] = useState(null);

  const [location, setLocation] = useState(REFERENCE_LOCATION);
  const [locationResolved, setLocationResolved] = useState(false);

  // Troca de modelo + persistência no aparelho.
  const setSelectedModelId = useCallback((id) => {
    setSelectedModelIdState(id);
    AsyncStorage.setItem(MODEL_KEY, id).catch(() => {});
  }, []);

  async function loadModels() {
    setLoadingModels(true);
    const { models: list, source } = await fetchModels();
    setModels(list);
    setModelsSource(source);

    // Recupera o último modelo escolhido, se ainda existir na lista.
    let saved = null;
    try {
      saved = await AsyncStorage.getItem(MODEL_KEY);
    } catch (e) {
      saved = null;
    }
    const validSaved = saved && list.some((m) => m.id === saved) ? saved : null;
    setSelectedModelIdState((prev) => prev || validSaved || (list[0] ? list[0].id : null));
    setLoadingModels(false);
  }

  // Pede permissão de localização; cai para São Paulo se negar/der erro.
  async function resolveLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          label: 'Sua localização',
        });
      } else {
        setLocation(REFERENCE_LOCATION);
      }
    } catch (e) {
      setLocation(REFERENCE_LOCATION);
    } finally {
      setLocationResolved(true);
    }
  }

  useEffect(() => {
    loadModels();
    resolveLocation();
  }, []);

  const selectedModel = useMemo(
    () => models.find((m) => m.id === selectedModelId) || null,
    [models, selectedModelId]
  );

  const value = useMemo(
    () => ({
      models,
      modelsSource,
      loadingModels,
      selectedModelId,
      selectedModel,
      setSelectedModelId,
      reloadModels: loadModels,
      location,
      locationResolved,
      probeId,
      setProbeId,
    }),
    [
      models,
      modelsSource,
      loadingModels,
      selectedModelId,
      selectedModel,
      setSelectedModelId,
      location,
      locationResolved,
      probeId,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de <AppProvider>.');
  return ctx;
}

export default AppContext;
