import BlockBuilder from "../components/BlockBuilder";

export default function BlockBuilderView() {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Construccion con Bloques
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Experimenta con un escenario estilo sandbox para practicar conceptos
          de mundos voxel: colocacion y eliminacion de bloques, materiales y
          coordenadas en 3D usando Three.js.
        </p>
      </header>
      <BlockBuilder />
    </section>
  );
}
