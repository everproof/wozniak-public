module Jekyll
  module Filters
    module LoadClientInfoFilter
      def load_client_info(input)
        # input: list of client names
        # output: list of client names and their info
        site = @context.registers[:site]
        clients_list = site.data['client_logos']['clients']
        clients_dict = Hash[clients_list.collect { |client| [client['name'], client]}]

        input
            .map { |client_name| clients_dict[client_name]}
            .select { |item| !item.nil? }
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::Filters::LoadClientInfoFilter)